import UnmatchedUser from "./unmatchedUser.js";
// MatchedUsers contains two unmatchedUsers

class MatchedUsers {
    static collectionName = "matched-users";
    constructor(id1, id2, email1, email2, topic, difficulty,questionId, ack1, ack2) {
        this.unmatch1 = new UnmatchedUser(id1, email1, topic, difficulty);
        this.unmatch2 = new UnmatchedUser(id2, email2, topic, difficulty);
        this.ack1 = ack1;
        this.ack2 = ack2;
        this.questionId = questionId;
    }

    // Matches given unmatch user with the unmatch user in matched users
    hasUser(user) {
        return this.unmatch1.matchTopicDiff(user) || this.unmatch2.matchTopicDiff(user);
    }
    
    toFirestore() {
        return {
            id1: this.unmatch1.id,
            email1: this.unmatch1.email,
            id2: this.unmatch2.id,
            email2: this.unmatch2.email,
            topic: this.unmatch1.topic, 
            difficulty: this.unmatch1.difficulty,
            questionId: this.questionId,
            addDatetime: Date.now(),
            ack1 : this.ack1,
            ack2 : this.ack2
        }
    }

    // Takes a Json user object
    fromJsonToReq(user) {
        if (user.email == this.unmatch1.email) {
            return {"matchedEmail": this.unmatch2.email , "matchedId" : this.unmatch2.id, "questionId": this.questionId};
        }
        return {"matchedEmail": this.unmatch1.email , "matchedId" : this.unmatch1.id, "questionId": this.questionId};
    }


    // Converts matchedJson to MatchedUsers Object
    static fromJsonToObject(matchedJson) {
        return new MatchedUsers(matchedJson.id1, matchedJson.id2, matchedJson.email1, matchedJson.email2, matchedJson.topic, matchedJson.difficulty, matchedJson.questionId, false, false);
    }

    static fromFirestore(matchedJson) {
        return new MatchedUsers(matchedJson.id1, matchedJson.id2, matchedJson.email1, matchedJson.email2, matchedJson.topic, matchedJson.difficulty,matchedJson.questionId, matchedJson.ack1, matchedJson.ack2);
    }
}

export default MatchedUsers;