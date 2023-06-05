import { createSlice } from '@reduxjs/toolkit';
import {
  createUser,
  deleteMultipleUser,
  deleteUser,
  getAllEmployee,
  getAllUsers,
  getUserDetails,
  updateUserDetails,
  updateUserPassword,
} from '../api/users';
import { covertToJSON } from '../../utils/stateToJson';

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    loading: false,
    error: {},
    userList: {},
    userDetails: {},
    employeeList: {},
  },
  reducers: {},
  extraReducers: {
    // get all employee
    [getAllEmployee.pending]: (state) => {
      state.loading = true;
    },
    [getAllEmployee.fulfilled]: (state, action) => {
      state.loading = false;
      state.employeeList = action.payload;
    },
    [getAllEmployee.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
    // get all users
    [getAllUsers.pending]: (state) => {
      state.loading = true;
    },
    [getAllUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.userList = action.payload;
    },
    [getAllUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // get single user details
    [getUserDetails.pending]: (state) => {
      state.loading = true;
    },
    [getUserDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.userDetails = action.payload;
    },
    [getUserDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // create user details
    [createUser.pending]: (state) => {
      state.loading = true;
    },
    [createUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.userDetails = action.payload;
      state.error = {};
    },
    [createUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // update user details
    [updateUserDetails.pending]: (state) => {
      state.loading = true;
    },
    [updateUserDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.userDetails = action.payload;
      state.error = {};
    },
    [updateUserDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // update user password
    [updateUserPassword.pending]: (state) => {
      state.loading = true;
    },
    [updateUserPassword.fulfilled]: (state) => {
      state.loading = false;
      state.error = {};
    },
    [updateUserPassword.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // update user password
    [deleteUser.pending]: (state) => {
      state.loading = true;
    },
    [deleteUser.fulfilled]: (state, action) => {
      const jsonState = covertToJSON(state)?.userList;
      const modifiedUserList = {
        ...jsonState,
        list: jsonState.list?.filter((user) => user._id !== action.payload),
      };
      state.loading = false;
      state.userList = modifiedUserList;
      state.error = {};
    },
    [deleteUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // update user password
    [deleteMultipleUser.pending]: (state) => {
      state.loading = true;
    },
    [deleteMultipleUser.fulfilled]: (state, action) => {
      const jsonState = covertToJSON(state)?.userList;
      const modifiedUserList = {
        ...jsonState,
        list: jsonState.list?.filter((user) => !action.payload?.includes(user._id)),
      };
      state.loading = false;
      state.userList = modifiedUserList;
      state.error = {};
    },
    [deleteMultipleUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  },
});
// export const {} = authSlice.actions;

export default usersSlice.reducer;
