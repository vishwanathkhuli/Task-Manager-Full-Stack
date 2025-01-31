import { createSlice } from "@reduxjs/toolkit";
import { registerUser, loginUser, userActions } from './userReducer';

const INITIAL_STATE = {
  message: "",
  status: "idle", // Can be "idle", "loading", "success", "error"
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: INITIAL_STATE,
  reducers: {
    setNotification: (state, action) => {
      state.message = action.payload.message;
      state.status = action.payload.status || "success";
    },
    clearNotification: (state) => {
      state.message = "";
      state.status = "idle";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.message = "Registering your details...";
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.message = "Registration Successful";
        state.status = "success";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.message = action.payload.response.data;
        state.status = "error";
      })
      .addCase(loginUser.pending, (state) => {
        state.message = "Verifying your details...";
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.message = "Verification Successful";
        state.status = "success";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.message = action.payload?.response?.data || "Login Failed";
        state.status = "error";
      })
      .addCase(userActions.logoutUser, (state) => {
        state.message = "Logout Successful";
        state.status = "success";
      });
  },
});

export const notificationActions = notificationSlice.actions;
export const useNotification = (state) => state.notification;
export default notificationSlice.reducer;
