
import { createSlice, PayloadAction} from '@reduxjs/toolkit';
import { User } from '../../utils/types';

type SliceState = { state: 'loading' } | { state: 'finished'; data: User | null}

const initialState: SliceState = { 
  state: 'finished',
  data: null,
}

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
      userLogin: {
        reducer(state, action: PayloadAction<User | null>) {
          state.data = (action.payload)
        },
        prepare(user: User | null) {
          return { payload: user }
        },
      }
    },
  })

  export const { userLogin } = userSlice.actions;
  export default userSlice.reducer;