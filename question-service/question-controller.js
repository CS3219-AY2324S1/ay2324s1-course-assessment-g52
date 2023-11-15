import Question from "./question-model.js";

async function getQuestion() {
  const count = await Question.countDocuments();
  const skip = Math.floor(Math.random() * count);
  const question = await Question.find().skip(skip).limit(1);
  return question;
}

export async function createQuestion(req, res) {
  // Find the maximum questionId
  const maxQuestion = await Question.findOne(
    {},
    { questionId: 1 },
    { sort: { questionId: -1 } }
  );
  const duplicateQuestion = await Question.findOne({questionTitle: req.body.questionTitle})
  if (duplicateQuestion) {
    return res.status(409).json({ message: "Question already exists" });
  }

  let newQuestionId = 1; // Default value if no questions are found

  if (maxQuestion) {
    newQuestionId = maxQuestion.questionId + 1;
  }
  // Create the question object without the questionId field
  var question = new Question({
    questionTitle: req.body.questionTitle,
    questionCategories: req.body.questionCategories,
    questionComplexity: req.body.questionComplexity,
    questionDescription: req.body.questionDescription,
    questionId: newQuestionId, // Set the calculated question ID
  });
  console.log(question);

  question
    .save()
    .then((result) => {
      console.log(result);
      res.json({ message: "Question Created", questionId: newQuestionId });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Question could not be created.", error: err });
    });
}

export async function getRandomQuestion(req, res) {
  try {
    res.status(200).json({
      question: await getQuestion(),
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
}

export async function getNewRandomQuestion(req, res) {
  try {
    const { oldQuestionId } = req.params;
    
    const count = await Question.countDocuments();
    if (count <= 1) { // no new question in the database
      res.status(404).json({
        error: "There is no new question",
      });
    }

    const newQuestion = await getQuestion();
    const newQuestionId = newQuestion[0].questionId;


    if (oldQuestionId == newQuestionId) {
      res.status(500).json({
        error: "Can not get new question, try again",
      });
    } else {
      res.status(200).json({
        question: newQuestion,
      }); 
    }
    
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
}

export async function getFilteredQuestions(req, res) {
  try {
    const query = req.query;
    let andQuery = {};
    let orQuery = [];
    let questions = [];

    if (query.id) andQuery.questionId = Number(query.id);
    if (query.complexity) andQuery.questionComplexity = query.complexity;
    if (query.categories) {
      if (Array.isArray(query.categories)) {
        for (const category of query.categories) {
          orQuery.push({ questionCategories: category });
        }
      } else {
        // 'categories' is a single value, convert it to an array
        orQuery.push({ questionCategories: query.categories });
      }
      questions = await Question.find({
        $and: [
          andQuery,
          {
            $or: orQuery,
          },
        ],
      });
    } else {
      questions = await Question.find({
        $and: [andQuery],
      });
    }

    console.log(questions.length);
    res.status(200).json({
      questions: questions,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
}

export async function getRandomFilteredQuestions(req, res) {
  try {
    const query = req.query;
    let andQuery = {};
    let orQuery = [];
    let questions = [];
    let randomQuestion = {};

    if (query.id) andQuery.questionId = Number(query.id);
    if (query.complexity) andQuery.questionComplexity = query.complexity;
    if (query.categories) {
      if (Array.isArray(query.categories)) {
        for (const category of query.categories) {
          orQuery.push({ questionCategories: category });
        }
      } else {
        // 'categories' is a single value, convert it to an array
        orQuery.push({ questionCategories: query.categories });
      }
      questions = await Question.find({
        $and: [
          andQuery,
          {
            $or: orQuery,
          },
        ],
      });
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * questions.length);

      // Retrieve the random question
      randomQuestion = questions[randomIndex];
    } else {
      questions = await Question.find({
        $and: [andQuery],
      });
      // Generate a random index
      const randomIndex = Math.floor(Math.random() * questions.length);

      // Retrieve the random question
      randomQuestion = questions[randomIndex];
    }

    console.log(questions.length);
    res.status(200).json({
      question: randomQuestion,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
}

export async function deleteQuestion(req, res) {
  const { id } = req.params;
  Question.deleteOne({ questionId: Number(id) })
    .then((result) => {
      if (result.deletedCount == 1) res.json({ message: "Question Deleted" });
      if (result.deletedCount == 0) res.json({ message: "Question Not Found" });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export const getQuestionById = async (req, res) => {
  const { id } = req.params;
  Question.findOne({ questionId: Number(id) })
    .then((result) => {
      if (result) res.json(result);
      if (!result) res.json({ message: "Question Not Found" });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { questionTitle, questionCategories, questionComplexity, questionDescription } = req.body;
  
  const duplicateQuestion = await Question.findOne({questionTitle: req.body.questionTitle})
  if (duplicateQuestion && duplicateQuestion.questionId != Number(id)) {
    return res.status(409).json({ message: "Question title exists" });
  }
  Question.findOne({ questionId: Number(id) })
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Question Not Found" })
      } else {
        Question.updateOne({ questionId: Number(id) }, { questionTitle, questionCategories, questionComplexity, questionDescription })
        .then((result) => {
          if (result.modifiedCount == 1) {
            res.json({ 
              message: "Question Updated",
              data: { 
                questionTitle, 
                questionCategories, 
                questionComplexity,
                questionDescription 
              }
            });
          } else if (result.modifiedCount == 0) {
            res.status(304).send({ message: "No change" });
          } else {
            res.status(520).send({ message: "Unknown Error" });
          }
        })
        .catch((err) => {
          res.status(500).send(err);
        });
      }
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
 
};

