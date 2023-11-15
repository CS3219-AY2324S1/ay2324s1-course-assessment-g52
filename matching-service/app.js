import FirestoreHandler from "./db/firestoreHandler.js";
import Matcher from "./matcher.js";
import cors from "cors";
import { routes } from "./matching-routes.js";
import QuestionServiceInstance from "./QuestionServiceInstance.js";
import express from "express";



const PROJECT_ID = 'peer-prep-399105';

const fh = new FirestoreHandler(PROJECT_ID);
await fh.connect();
const qst = new QuestionServiceInstance();
const matcher = new  Matcher(fh, qst);



const app = express();

app.use(cors({
    origin: '*'
}));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api", routes);

app.listen(8080, () => {
    console.log("App Intialised on port 8080");
});



export default matcher;




