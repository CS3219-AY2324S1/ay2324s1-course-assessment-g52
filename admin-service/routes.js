import express from "express";
import {
  getUser,
  setUserRole,
} from "./admin-controller.js";

let router = express.Router();

//Get random question
router.get("/admin/user", getUser);

router.post("/admin/set-role", setUserRole);

router.get("/admin/test", (req, res) => { res.send("Question Service Version 6"); });

export let routes = router;
