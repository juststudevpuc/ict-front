import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  refresh: false, // add refresh flag
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    updateUser: (state, action) => {
      const { id, data } = action.payload;
      const index = state.users.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...data };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((item) => item.id !== action.payload);
    },
    clearAll: (state) => {
      state.users = [];
    },
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    },
  },
});

export const { addUser, updateUser, deleteUser, clearAll, setRefresh } =
  userSlice.actions;
export default userSlice.reducer;
