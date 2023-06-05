import { createSlice } from '@reduxjs/toolkit';
import { getAuthenticatedUserApi, loginApi, logoutApi, registerApi } from '../api/auth';
import { updateUserDetails } from '../api/users';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading: false,
    error: {},
    user: {
      email: '',
      username: '',
      roles: [''],
      isActive: false,
    },
  },
  reducers: {},
  extraReducers: {
    // login
    [loginApi.pending]: (state) => {
      state.loading = true;
    },
    [loginApi.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = {};
    },
    [loginApi.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // update profile
    [updateUserDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = {};
    },

    // register
    [registerApi.pending]: (state) => {
      state.loading = true;
    },
    [registerApi.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = {};
    },
    [registerApi.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // get authenticated user
    [getAuthenticatedUserApi.pending]: (state) => {
      state.loading = true;
    },
    [getAuthenticatedUserApi.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = {};
    },
    [getAuthenticatedUserApi.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // logout
    [logoutApi.fulfilled]: (state) => {
      state.user = {};
      state.error = {};
    },
    [logoutApi.rejected]: (state, action) => {
      state.error = action.error;
    },
  },
});
// export const {} = authSlice.actions;

export default authSlice.reducer;
