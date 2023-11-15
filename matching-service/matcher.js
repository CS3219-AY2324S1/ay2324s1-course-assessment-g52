import UnmatchedUser from "./models/unmatchedUser.js";
import MatchedUsers from "./models/matchedUsers.js";

class Matcher {
    
    constructor(firestoreHandler, questInst) {
        this.firestoreHandler = firestoreHandler;
        this.QueueOrderBy = "addDatetime";
        this.QueueOrderPref = "asc";
        this.Queuelimit = 1;
        this.questInst = questInst;
        this.timeToMatch = 60; // In Seconds

    }

    // etiher queus the user ot be matched , or adds the match to the database
    async findMatch(user, idToken) {

        

        const db = await this.firestoreHandler.getDb("findMatch");
        console.log(`The db is: ${db}`);
        await db.runTransaction(async (t) => {
            console.log(`User is ${user}`);

            const userJson = {"email": user.email, "id": user.id, "topic": user.topic, "difficulty": user.difficulty};
            const umUser = UnmatchedUser.toObject(userJson);
            console.log(`User is ${umUser.toFirestore()}`);
            // Search in Unmatched Queue
            const queryRes = await this.firestoreHandler.readwithAndQuery(t, UnmatchedUser.collectionName, this.QueueOrderBy, this.QueueOrderPref, this.Queuelimit, umUser.getMatchPredicates());

            
            if (queryRes == null) {
                await this.addUser(t,umUser);
                console.log(`Added User: ${userJson.email} to Queue`);
            } else {
                // Get MatchedUser
                let matchedUserEmail = null;
                

                for (var key in queryRes) {
                    matchedUserEmail = key;
                }

                const matchedUserJson = queryRes[matchedUserEmail];
                
                if (matchedUserEmail == umUser.email) {
                    // Cannot Match with the same email , so invalid match
                    console.log(`Invalid Match: Identical email match detected. user email: ${matchedUserEmail}`)
                } else if (Date.now() - queryRes[matchedUserEmail].addDatetime >= this.timeToMatch * 1000  ) {
                    // User Found has already expired
                    // Delete the expired user from match queue 
                    this.deleteUser(t, matchedUserJson)

                    // Add current user to Queue
                    await this.addUser(t,umUser);
                    console.log(`Invalid Match: Expired User matched. Expired user email: ${matchedUserEmail}`)
                } else {
                // Get Question Id
                const questionId = await this.questInst.getQuestionId(umUser.difficulty, umUser.topic, idToken);
                
                console.log(`Question Id is ${questionId}`);
                
                

                // From matcheUserJson
                const matchedJson = {"email1" : umUser.email, "id1": umUser.id ,"email2": matchedUserJson.email , "id2" : matchedUserJson.id, "topic": umUser.topic, "difficulty" : umUser.difficulty, "questionId": questionId};
                // Make Object
                console.log(`MatchedJson ${matchedJson}`);
                const matchedUsers = MatchedUsers.fromJsonToObject(matchedJson);

                // Add Matched user
                await this.addMatchToFind(t, matchedUsers, matchedUserJson);

                console.log(`Added match: ${matchedJson} to matches db`);
        }
        }
    });
    }


    // Returns the match found for the user email and deals with match Foudn logic
    async checkMatches(user) {
        const db = await this.firestoreHandler.getDb("checkMatch");

        return await db.runTransaction(async (t) => {
        const userJson = {"email": user.email, "id": user.id, "topic": user.topic, "difficulty": user.difficulty};
        const umUser = UnmatchedUser.toObject(userJson);
        const queryRes = await this.firestoreHandler.readwithOrQuery(t, MatchedUsers.collectionName, this.QueueOrderBy, this.QueueOrderPref, this.Queuelimit, umUser.getMatchesPredicates());

        
        if (queryRes != null) {
            // Match Found
            let matchFoundEmail = null;
            for (var key in queryRes) {
                matchFoundEmail = key;
            }
            const matchFound = queryRes[matchFoundEmail];
            const matchObject = MatchedUsers.fromJsonToObject(matchFound);
            if ((Date.now() - matchFound.addDatetime) > this.timeToMatch*2 * 1000) {
                // Invalid / Old Match 
                await this.deleteMatch(t, matchFoundEmail);
                
                // So no match found
                return null;
            }// Acknowledge the match
            else if (matchFound.ack1 || matchFound.ack2) {
                // Match Found & One of the matches already acked 
                // Delete the Match
                await this.deleteMatch(t, matchFoundEmail);
            } else {
                // match Found but noone acked
                // Ack and store the one Found
                if (userJson.email == matchFoundEmail) {
                    // Current user is user1
                    matchFound.ack1 = true;
                } else {
                    // Current user us user2
                    matchFound.ack2 = true;
                }

                await this.updateMatchFromJson(t,matchFound,matchFoundEmail);

            }
            
            // Returned the match user
            return matchObject.fromJsonToReq(user);

        } 

        // No Match Found
        return null;
        });
    }


    async removeUser(user) {
        const db = await this.firestoreHandler.getDb("removeUser");

        return await db.runTransaction(async (t) => {
        const userJson = {"email": user.email, "id": user.id, "topic": user.topic, "difficulty": user.difficulty};
        const umUser = UnmatchedUser.toObject(userJson);
        const unmatchRes = await this.firestoreHandler.readwithAndQuery(t, UnmatchedUser.collectionName, this.QueueOrderBy, this.QueueOrderPref, this.Queuelimit, umUser.getExactMatchPredicate());
        const matchRes = await this.firestoreHandler.readwithOrQuery(t,MatchedUsers.collectionName, this.QueueOrderBy, this.QueueOrderPref, this.Queuelimit, umUser.getMatchesPredicates());
        
        if (unmatchRes != null) {
            //Found unmatch
            console.log("Found in Unmatched Queue");
            await this.deleteUser(t,umUser);

        } else if (matchRes != null) {
            console.log("Found in Matched.");
            // Found a match
             let matchFoundEmail = null;
            for (var key in matchRes) {
                matchFoundEmail = key;
            }
            await this.deleteMatch(t,matchFoundEmail);

        } else {
            // Not in the database
            throw new Error("Not in the Database");
        }
    });

    }

    // Utiltiy Functions For Add 

    // Takes in Unmatched user object
    async addUser(db,user) { 
        await this.firestoreHandler.write(db,UnmatchedUser.collectionName, user.email,user.toFirestore() );
    }


    // Takes in Unmatched user object 
    async addMatchToFind(db, mUsers, deleteUser) {
        // Add the Match
        await this.firestoreHandler.write(db, MatchedUsers.collectionName, deleteUser.email, mUsers.toFirestore());

        await this.deleteUser(db, deleteUser);


        
    }

    // Takes in Matched user json
    async updateMatchFromJson(db, updateMatchJson, matchFoundEmail) {
        await this.firestoreHandler.write(db,MatchedUsers.collectionName, matchFoundEmail, updateMatchJson);
    }

    async deleteUser(db,user) {
        // Delete the Matched User
        await this.firestoreHandler.delete(db, UnmatchedUser.collectionName, user.email);
    }

    async deleteMatch(db,matchId) {
        await this.firestoreHandler.delete(db,MatchedUsers.collectionName, matchId);
    }
}

export default Matcher;