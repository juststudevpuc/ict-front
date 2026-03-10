// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   id: null,
//   name: "",
//   email: "",
//   role: ""
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser: (state, action) => ({ ...action.payload }), // ✅ store full user object
//     logout: () => initialState,                          // ✅ reset to initial
//   },
// });

// export const { setUser, logout } = userSlice.actions;
// export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import SecureLS from "secure-ls";

// 1. Initialize AES encryption
const ls = new SecureLS({ encodingType: "aes" });

// 2. Define your default empty state
const defaultState = {
  id: null,
  name: "",
  email: "",
  role: ""
};

// 3. Helper to decrypt user data on page refresh
const getInitialUser = () => {
  try {
    const storedUser = ls.get("user");
    // If a stored user exists, return it. Otherwise, return the empty default state.
    return storedUser ? storedUser : defaultState;
  } catch (error) {
    return defaultState;
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: getInitialUser(),
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      
      // Safety check: If payload is null/empty, act like a logout
      if (!user) {
        ls.remove("user");
        return defaultState;
      }

      // Encrypt and save to local storage
      ls.set("user", user); 
      // Update Redux state
      return { ...user }; 
    },
    
    logout: () => {
      // Destroy the encrypted local storage data
      ls.remove("user"); 
      // Reset Redux to initial empty values
      return defaultState; 
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;