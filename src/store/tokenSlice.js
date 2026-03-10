// import { createSlice } from "@reduxjs/toolkit";

// const tokenSlice = createSlice({
//     name : "token",
//     initialState: { value: ""}, 
//     reducers: {
//         setToken: (state, actions) => {
//             state.value = actions.payload;
//         }
//     }
// });

// export const { setToken } = tokenSlice.actions;
// export default tokenSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import SecureLS from "secure-ls";

// 1. Initialize high-level AES encryption
const ls = new SecureLS({ encodingType: "aes" });

// 2. Helper to safely grab the encrypted token on page refresh
const getInitialToken = () => {
  try {
    return ls.get("token") || "";
  } catch (error) {
    // If someone tampers with local storage, it fails safely
    return ""; 
  }
};

const tokenSlice = createSlice({
  name: "token",
  initialState: { value: getInitialToken() }, 
  reducers: {
    setToken: (state, actions) => {
      const token = actions.payload;
      state.value = token;
      
      // 3. Automatically Encrypt or Destroy based on the payload
      if (token) {
        ls.set("token", token); // Encrypt and save on Login
      } else {
        ls.remove("token"); // Destroy on Logout (when you pass null)
      }
    }
  }
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;