const userDb = require('./userQueries')
const submissionsDb = require('./submissionQueries');
const express = require('express')

let router = express.Router();
const admin =  require('firebase-admin');

const cert = {
    type: process.env.SA_TYPE,
    project_id: process.env.SA_PROJECT_ID,
    private_key_id: process.env.SA_PRIVATE_KEY_ID,
    private_key: process.env.SA_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.SA_CLIENT_EMAIL,
    client_id: process.env.SA_CLIENT_ID,
    auth_uri: process.env.SA_AUTH_URI,
    token_uri: process.env.SA_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.SA_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.SA_CLIENT_X509_CERT_URL,
    universe_domain: process.env.SA_UNIVERSE_DOMAIN,
}
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(cert)
});

const guard = (roles) => {
    return async (req, res, next) => {
        try {
            const idToken = req.headers.authorization.split(' ')[1];
            const decodedToken = await firebaseApp.auth().verifyIdToken(idToken);
            if (roles.length === 0) {
                next();
            } else {
                const userRoles = decodedToken.roles;
                if (!userRoles) throw new Error('Unauthorized');
                roles.forEach(role => {
                if (!userRoles.includes(role)) {
                    throw new Error('Unauthorized');
                }
                });
                next();
            }  
        } catch (err) {
            res.status(401).send('Unauthorized');
        }
    };
}

const guardByIdOrRoles = (roles) => {
    return async (req, res, next) => {
        try {
            const idToken = req.headers.authorization.split(' ')[1];
            const decodedToken = await firebaseApp.auth().verifyIdToken(idToken);
            if (decodedToken.user_id !== req.params.id) {
                if (roles.length === 0) {
                    throw new Error('Unauthorized');
                } else {
                    const userRoles = decodedToken.roles;
                    if (!userRoles) throw new Error('Unauthorized');
                    roles.forEach(role => {
                        if (!userRoles.includes(role)) {
                            throw new Error('Unauthorized');
                        }
                    });
                }
            }
            next();
        } catch (err) {
            res.status(401).send('Unauthorized');
        }
    };
};

router.get('/test-unauth', (req, res) => res.send('Hello World! 1'));

router.get(
    '/test',
    guard([]),
    (req, res) => res.send('Hello User!')
);

router.get(
    '/test/admin',
    guard(['ADMIN']),
    (req, res) => res.send('Hello Admin!')
);
router.get(
    '/test/:id',
    guardByIdOrRoles(['ADMIN']),
    (req, res) => res.send(`Hello ${req.params.id}!`)
);
  
router.get(
    '/users',
    guard(['ADMIN']),
    userDb.getUsers
);
router.get(
    '/users/signedin/:id',
    userDb.getUserById
);

router.post(
    '/users/login',
    guard([]),
    userDb.loginUser
);
router.post(
    '/users',
    guard([]),
    userDb.createUser,
);
router.delete('/users/signined/:id', userDb.deleteUser);

router.put(
    '/submissions/:id',
    guardByIdOrRoles(['ADMIN']),
    submissionsDb.upsertSubmission
);

router.get(
    '/submissions/:id',
    guardByIdOrRoles(['ADMIN']),
    submissionsDb.getAllSubmissionsByUser
);
router.get(
    '/submissions/:id/:questionId/:languageId',
    guardByIdOrRoles(['ADMIN']),
    submissionsDb.getOneSubmission
)
router.delete(
    '/submissions',
    guard(['ADMIN']),
    submissionsDb.deleteSubmission
);

router.delete(
    '/submissions/:id',
    guardByIdOrRoles(['ADMIN']),
    submissionsDb.deleteSubmission
);

module.exports = router;
