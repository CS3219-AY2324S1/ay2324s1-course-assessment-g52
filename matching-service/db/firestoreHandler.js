import { Filter, Firestore,Transaction } from '@google-cloud/firestore';

class FirestoreHandler {
    constructor(projectId) {
        this.db = null;
        this.projectId = projectId;
    }
    
    // Connects the database
    connect() {
        this.db = new Firestore({
            projectId: this.projectId,
          });
    }

    //Write To Database
    // collection is the name of the collection
    // docData should be a json Object
    async write(db = this.db, collectId, docId, docData) {
        if (this.db == null) {
            throw new Error(`DATABASE ERROR:: Database not intialised`);
        }
        try {
        const docRef = this.db.collection(collectId).doc(docId);
        await db.set(docRef, docData);
        } catch(err) {
            throw new Error(`DATABASE_ADD ERROR: Could Not Add to Collection; ${collectId}, Document; ${docId} and Document Data; ${docData}: ${err} `)
        }
    }

    //Query Database (Read)
    // Only And Queries Can be executed
    async readwithAndQuery(db = this.db, collectId, order,orderPref, limit, predicates) {
        if (db == null){
            throw new Error(`DATABASE ERROR: Database not intialised`);
        } 
        const collectRef = this.db.collection(collectId);
        let query = collectRef;
        for(var p in predicates) {
            // Chains the And Where statements together
            var pred = predicates[p];
            query = query.where(pred.getCond1() , pred.getOp(), pred.getCond2());
        }
        const snapshot = await db.get(query.orderBy(order, orderPref).limit(limit));
        if (snapshot.empty) {
            console.log(`No Matching document with collection: ${collectId}, order: ${order} and limit: ${limit}`);
            return null;
        } 
        console.log(`Snapshot is : ${snapshot}`);

        const res = {}
            snapshot.forEach(doc => {
                console.log(`Doc is : ${doc}`)
                console.log(`Doc Data is : ${doc.data()}`)
                res[doc.id] = doc.data();
              });
        
        console.log(`res is: ${res}`);
            
        return res;

    }

    async readwithOrQuery(db = this.db, collectId, order,orderPref, limit, predicates) {
        if (this.db == null){
            throw new Error(`DATABASE ERROR: Database not intialised`);
        } 
        const collectRef = this.db.collection(collectId);
        let query = collectRef;
        let filters = [];
        for(var p in predicates) {
            // Chains the And Where statements together
            var pred = predicates[p];
            console.log(pred);
            filters.push(Filter.where(pred.getCond1() , pred.getOp(), pred.getCond2()));
        }

        console.log(`Filters are ${filters}`);

        const snapshot = await db.get(query.where(Filter.or.apply(null, filters)).orderBy(order, orderPref).limit(limit));
        if (snapshot.empty) {
            console.log(`No Matching document with collection: ${collectId}, order: ${order} and limit: ${limit}`);
            return null;
        } 
        const res = {}
            snapshot.forEach(doc => {
                res[doc.id] = doc.data();
              });
            
        return res;

    }

    // returns Json Object of the query executed
    async readwithoutQuery(db = this.db, collectId, order,orderPref, limit) {
        if (db == null){
            throw new Error(`DATABASE ERROR: Database not intialised`);
        } 

            const collectRef = db.collection(collectId);
            const snapshot = await collectRef.orderBy(order, orderPref).limit(limit).get();
            if (snapshot.empty) {
                console.log(`No Matching document with collection: ${collectId}, order: ${order} and limit: ${limit}`);
                return null;
            }
            const res = {}
            snapshot.forEach(doc => {
                res[doc.id] = doc.data();
              });
            
            return res;

    }
    

    //Delete Ftom Database
    async delete(db = this.db, collectId, docId) {
        if (db == null) {
            throw new Error(`DATABASE ERROR: Database not intialised`);
        }
        try {
        const docRef = this.db.collection(collectId).doc(docId);
        await db.delete(docRef);
        } catch(err) {
            throw new Error(`DATABASE_DELETE ERROR: Could Not Delete from Collection; ${collectId}, Document; ${docId} : ${err} `)
        }
    }

    //Async getDb
    async getDb(requestTag) {
        return this.db
    }

}

export default FirestoreHandler;