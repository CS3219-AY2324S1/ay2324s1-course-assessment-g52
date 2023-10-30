import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";
import dotenv from "dotenv";

dotenv.config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_DB_URL);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET /api/questions/random-filtered", () => {
  it("should respond with an array of filtered questions", async () => {
    const response = await request(app).get(
      "/api/questions?categories=&complexity=Easy&id=2"
    );
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.questions)).toBe(true);
    expect(response.body.questions.length).toBe(1);
    expect(response.body.questions[0].questionId).toBe(2);
    expect(response.body.questions[0].questionComplexity).toBe("Easy");
    expect(response.body.questions[0].questionCategories).toEqual(
      expect.arrayContaining(["Data Structures", "Algorithms"])
    );
  });
});
