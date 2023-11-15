import { getAuth } from 'firebase-admin/auth';
import admin from 'firebase-admin';
import serviceAccount from "./serviceAccount.json" assert { type: "json" };

const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const getUser = (req, res) => {
    firebaseApp.auth().getUser(req.query?.id).then((userRecord) => {
        res.json(userRecord);
    }).catch((error) => {
        res.status(422).send("error:", error);
    })
}

export const setUserRole = async (req, res) => {
    const { uid, roles} = req.body;
    const aaa = await firebaseApp.auth().getUser(uid).catch((error) => {
        console.error(error)
    })
    if (uid && roles && aaa) {
        try {
            
            firebaseApp.auth().setCustomUserClaims(uid, { roles })
            res.json({ uid, roles});
        } catch (error) {
            res.status(422).send(error);
        }
    } else {
        res.status(422).send("Invalid/Missing uid/roles")
    }
   

}