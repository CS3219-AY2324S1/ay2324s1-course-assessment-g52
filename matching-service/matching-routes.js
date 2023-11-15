import express from "express";

import {
  findMatch,
  checkMatch,
  removeUser
} from "./matching-controller.js";

let router = express.Router();

//Find the Match for the user
router.post("/match/find-match", findMatch);

//Check user Matched
router.post("/match/check-match", checkMatch);

// Remove User
router.post("/match/remove-user",removeUser)



export let routes = router;
