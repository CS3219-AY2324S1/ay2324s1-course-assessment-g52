import Predicate from "../db/predicate.js";

class UnmatchedUser {
    static collectionName = 'unmatched-users';

    constructor(id, email,topic, difficulty) {
        this.id = id;
        this.email = email;
        this.topic = topic;
        this.difficulty = difficulty;
    }

    // Firestore Serializer
    toFirestore() {
        return {
            id: this.id,
            email: this.email,
            topic: this.topic, 
            difficulty: this.difficulty,
            addDatetime: Date.now()
        }
    }
    

    // Matches Topic and Difficulty
    matchTopicDiff(user2) {
        return (this.topic == user2.topic)  && (this.difficulty == user2.difficulty);
    }

    // Takes a user Json and returns and Unmatched User isntance
    // Can be used with Request body and Firestore Read
    static toObject(userJson) {
        return new UnmatchedUser(userJson.id,userJson.email, userJson.topic, userJson.difficulty);
    }

    getMatchPredicates() {
        return [new Predicate("topic" , "==",this.topic) , new Predicate("difficulty", "==", this.difficulty)];
    }

    getExactMatchPredicate() {
        return [new Predicate("email" , "==",this.email)];
    }

    getMatchesPredicates() {
        return [new Predicate("email1" , "==",this.email) , new Predicate("email2", "==", this.email)];
    }


}
export default UnmatchedUser;