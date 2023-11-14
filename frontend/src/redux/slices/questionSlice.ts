
import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Question, UpdateQuestion } from '../../utils/types';
import { filter, findIndex} from 'lodash';

type SliceState = { state: 'loading' } | { state: 'finished'; data: Question[] }

const dummyQuestions: Question[] = [{
    id: "1",
    title: "Reverse a String",
    description: "Write a function that reverses a string. The input string is given as an array\nof characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra\nmemory.\n\n\nExample 1:\n\nInput: s = [\"h\",\"e\",\"l\",\"l\",\"o\"]\nOutput: [\"o\",\"l\",\"l\",\"e\",\"h\"]\nExample 2:\n\nInput: s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]\nOutput: [\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]\n\nConstraints:\n\n 1 <= s.length <= 105\n s[i] is a printable ascii character",
    category: ["Algorithms", "Strings"],
    complexity: "Easy",
    createdAt: "time1",
    updatedAt: "time2",
    createdBy: "USER1"
  },
  {
    id: "2",
    title: "Linked List Cycle Detection",
    description: "Given head, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer. Internally, pos is used to denote the index of the node that tail's next pointer is connected to. Note that pos is not passed as a parameter.\n\nReturn true if there is a cycle in the linked list. Otherwise, return false.",
    category: ["Algorithms", "Data Structures"],
    complexity: "Easy",
    createdAt: "time1",
    updatedAt: "time2",
    createdBy: "USER1"
  }
]

const initialState: SliceState = { 
  state: 'finished',
  data: dummyQuestions
}

const questionSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
      addQuestion: {
        reducer(state, action: PayloadAction<Question>) {
          state.data.push(action.payload)
        },
        prepare(question: Question) {
          return { payload: question }
        },
      },
      deleteQuestion: {
        reducer(state, action: PayloadAction<string>) {
          state.data = filter(state.data, (q: Question) => {
            return q.id != action.payload
          })
        },
        prepare(id: string) {
          return { payload: id }
        }
      },
      updateQuestion: {
        reducer(state, action: PayloadAction<UpdateQuestion>) {
          const index = findIndex(state.data, (q: Question) => {
            return q.id == action.payload.id
          })
          state.data.splice(index, 1, {...state.data[index], ...action.payload, updatedAt: new Date().toISOString()})
        },
        prepare(question: UpdateQuestion) {
          return { payload: question }
        },
      }
    },
  })

  export const { addQuestion, deleteQuestion, updateQuestion } = questionSlice.actions;
  export default questionSlice.reducer;