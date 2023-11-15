import express from "express";
import serviceAccount from "./serviceAccount.json" assert { type: "json" };
import admin from "firebase-admin";
import {
  createQuestion,
  getRandomQuestion,
  getFilteredQuestions,
  deleteQuestion,
  updateQuestion,
  getRandomFilteredQuestions,
  getQuestionById,
  getNewRandomQuestion,
} from "./question-controller.js";

let router = express.Router();
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
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

//Create new question based on request body
router.post(
  "/questions/new",
  guard(["ADMIN"]),
  createQuestion
);

//Get random question
router
  .get("/questions/random", getRandomQuestion);

//Get new random question
router
  .get("/questions/random/:oldQuestionId", getNewRandomQuestion);

//Get list of questions based on query parameters
router.get(
  "/questions",
  guard([]),
  getFilteredQuestions
);

//Get 1 random question based on query parameters
router.get(
  "/questions/random-filtered",
  guard([]),
  getRandomFilteredQuestions
);

router.get(
  "/questions/:id",
  guard([]),
  getQuestionById
);
// Updates a question based on questionId
router.put(
  "/questions/:id",
  guard(['ADMIN']),
  updateQuestion
);

//Delete question based on questionId
router.delete(
  "/questions/:id",
  guard(['ADMIN']),
  deleteQuestion
);

router.get("/questions/test", (req, res) => { res.send("Question Service Version 8"); });

export let routes = router;