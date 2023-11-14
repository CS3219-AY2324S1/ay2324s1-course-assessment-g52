import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuth } from "firebase/auth";

const QUESTION_URL = import.meta.env.VITE_QUESTION_URL;
const MATCH_URL = import.meta.env.VITE_MATCH_URL;
const USER_URL = import.meta.env.VITE_USER_URL;

type QuestionCreateProps = {
  questionTitle: string;
  questionDescription: string;
  questionComplexity: string;
  questionCategories: string[];
};
type UserCredentials = {
  email: string;
  firebaseId: string;
}


type RemoveUserProps = {
  id: string;
  email: string;
  topic: string;
  difficulty: string;
};

type QuestionUpdateProps = {
  id: string;
  data : {
    questionTitle: string;
    questionDescription: string;
    questionComplexity: string;
    questionCategories: string[];
  }
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: ``,
    prepareHeaders: async (headers) => {
      const auth = getAuth();
      await auth.currentUser?.getIdTokenResult().then((idTokenResult) => {
        headers.set("authorization", `Bearer ${idTokenResult.token}`);
      });
      return headers;
    },
  }),
  tagTypes: ["Question", "Match"],
  endpoints: (builder) => ({
    getQuestions: builder.query<{ questions: any[] }, void>({
      query: () => ({
        url: `${QUESTION_URL}`,
        method: "GET",
      }),
      providesTags: ["Question"],
    }),
    createQuestion: builder.mutation<{ question: any }, QuestionCreateProps>({
      query: (question) => ({
        url: `${QUESTION_URL}/new`,
        method: "POST",
        body: question,
      }),
      invalidatesTags: ["Question"],
    }),
    deleteQuestion: builder.mutation<{ question: any }, string>({
      query: (id) => ({
        url: `${QUESTION_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
    updateQuestion: builder.mutation<{ question: any }, QuestionUpdateProps>({
      query: (question) => ({
        url: `${QUESTION_URL}/${question.id}`,
        method: 'PUT',
        body: question.data,
      }),
      invalidatesTags: ['Question'],
    }),
    login: builder.mutation<{ token: any}, UserCredentials>({
      query: (credentials) => ({
        url: `${USER_URL}/users/login`,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ["Match"],
    }),
    createUser: builder.mutation<{ token: string; }, UserCredentials>({
      query: (credentials) => ({
        url: `${USER_URL}/users`,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ["Match"],
    }),
    removeUser: builder.mutation<ResponseType, RemoveUserProps>({
      query: (userData) => ({
        url: `${MATCH_URL}/remove-user`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Match"],
    }),
    deleteUser: builder.mutation<{ token: string; user: any }, string>({
      query: (id) => ({
        url: `${USER_URL}/users/signined/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useRemoveUserMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useLoginMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
} = api;
