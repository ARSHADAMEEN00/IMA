import { createAsyncThunk } from '@reduxjs/toolkit';
import { activeSnack } from '../store/common';
import { del, get, post, put } from './http';

export const getAllEmployee = createAsyncThunk('users/employee', async ({ search, dispatch }) => {
  try {
    const URL = search ? `/admin/user/employee/available?search=${search && search}` : `/admin/user/employee/available`;
    const response = await get(URL);

    if (response.isSuccess) {
      return response;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
    throw error?.response?.data?.error;
  }
});
export const getAllUsers = createAsyncThunk(
  'users/list',
  async ({ page, limit, search, sortBy, sortDirection, userTypes, dispatch }) => {
    try {
      const URL = `/admin/user/${userTypes && userTypes}?page=${page && page}&limit=${limit && limit}&search=${
        search && search
      }&sortBy=${sortBy && sortBy}&sortDirection=${sortDirection && sortDirection}`;

      const response = await get(URL);
      if (response.isSuccess) {
        return response;
      }
      return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
    } catch (error) {
      dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
      throw error?.response?.data?.error;
    }
  }
);

export const getUserDetails = createAsyncThunk('users/single', async ({ userId, dispatch }) => {
  try {
    const response = await get(`/admin/user/single/${userId}`);
    if (response.isSuccess) {
      return response?.user;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
    throw error?.response?.data?.error;
  }
});

export const createUser = createAsyncThunk('users/create', async ({ state, dispatch, navigate }) => {
  try {
    const response = await post(`/admin/user/create`, state);
    if (response.isSuccess) {
      navigate(-1);
      dispatch(activeSnack({ type: 'success', message: response?.message }));
      return response?.user;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
    throw error?.response?.data?.error;
  }
});

export const updateUserDetails = createAsyncThunk('users/update', async ({ state, userId, dispatch, navigate }) => {
  try {
    const response = await put(`/admin/user/update/${userId}`, state);
    if (response.isSuccess) {
      dispatch(activeSnack({ type: 'success', message: response?.message }));
      if (navigate) {
        navigate();
      }
      return response?.user;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
    throw error?.response?.data?.error;
  }
});

export const updateUserPassword = createAsyncThunk(
  'users/update/password',
  async ({ state, userId, dispatch, handleClose }) => {
    try {
      const response = await put(`/admin/user/update/password/${userId}`, state);
      if (response.isSuccess) {
        handleClose();
        return dispatch(activeSnack({ type: 'success', message: response?.message }));
      }
      return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
    } catch (error) {
      dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
      throw error?.response?.data?.error;
    }
  }
);

export const deleteUser = createAsyncThunk('users/delete', async ({ userId, dispatch, handleCloseDeleteDialog }) => {
  try {
    const response = await del(`/admin/user/delete/${userId}`);
    if (response.isSuccess) {
      handleCloseDeleteDialog();
      dispatch(activeSnack({ type: 'success', message: response?.message }));
      return response?.userId;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
    throw error?.response?.data?.error;
  }
});

export const deleteMultipleUser = createAsyncThunk(
  'users/delete/multiple',
  async ({ userIds, dispatch, handleCloseDeleteDialog, setSelectedUserIds }) => {
    try {
      const response = await post(`/admin/user/delete/multiple`, { userIds });
      if (response.isSuccess) {
        dispatch(activeSnack({ type: 'success', message: response?.message }));
        handleCloseDeleteDialog();
        setSelectedUserIds([]);
        return response?.userIds;
      }
      return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
    } catch (error) {
      dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
      throw error?.response?.data?.error;
    }
  }
);
