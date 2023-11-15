import matcher from "./app.js";



export async function findMatch(req, res) {
    var user= {"id" : req.body.id , "email": req.body.email, "topic" : req.body.topic , "difficulty": req.body.difficulty};
    console.log(user);
    console.log(`Request Header is ${JSON.stringify(req.headers)}`);
    let idToken = null;
    try {
      // For GCP Case
      console.log("GCP Case")
      idToken = req.headers["x-forwarded-authorization"].split(' ')[1]
    } catch (error) {
      // For Normal Case
      console.log("Normal")
      idToken = req.headers.authorization.split(' ')[1];
    }
    
    console.log(`Id token is ${idToken}`);

    matcher
      .findMatch(user, idToken)
      .then((result) => {
        res
        .status(200)
        .json({ message: `User: ${user.email} added to matching Queue` });
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message:`User: ${user.email} could not be added to matching Queue`, error: err.message });
      });
  }


  export async function checkMatch(req, res) {
    var user= {"id" : req.body.id , "email": req.body.email, "topic" : req.body.topic , "difficulty": req.body.difficulty};
    console.log(user);
  
    matcher
      .checkMatches(user)
      .then((result) => {
        let matched_user = result;
        if (matched_user != null) {
            res
            .status(200)
            .json({ 
                message: `User: ${user.email}  Matched`,
                matched_user: matched_user
                });
        } else {
            res
            .status(200)
            .json({ 
                message: `User: ${user.email} Not Matched`
                });
        }
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: `Could not check user: ${user.email} match: `, error: err.message });
      });
  }

  export async function removeUser(req, res) {
    var user= {"id" : req.body.id , "email": req.body.email, "topic" : req.body.topic , "difficulty": req.body.difficulty};
    console.log(user);
  
    matcher
      .removeUser(user)
      .then((result) => {
        res
        .status(200)
        .json({ 
              message: `User: ${user.email} has been deleted`
      })
    })
      .catch((err) => {
        res
          .status(500)
          .json({ message: `Could not delete user: ${user.email} match: `, error: err.message });
      });
    
  }