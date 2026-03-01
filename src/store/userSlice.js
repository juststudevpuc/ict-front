import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: "",
  email: "",
  role: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => ({ ...action.payload }), // ✅ store full user object
    logout: () => initialState,                          // ✅ reset to initial
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
