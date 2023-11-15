
export const validateToken = async (firebaseApp, token) => {
    try {
        const decodedToken = await firebaseApp.auth().verifyIdToken(token);
        console.log("valid token", decodedToken)
        return true;
    } catch (err) {
        console.log("error validating token", err)
        return false
    }
}