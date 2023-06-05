import { createAsyncThunk } from '@reduxjs/toolkit';
import { useSetRole, useSetToken } from '../../hooks/useHandleSessions';
import { activeSnack } from '../store/common';
import { get, post } from './http';

export const loginApi = createAsyncThunk('auth/login', async ({ state, dispatch, navigate }) => {
  try {
    const response = await post('/auth/login', state);
    if (response?.isSuccess) {
      dispatch(activeSnack({ type: 'success', message: response.message }));
      useSetToken(response?.token);
      useSetRole(response?.user?.role);
      navigate('/dashboard', { replace: true });
      return response?.user;
    }

    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
    throw error?.response?.data?.error;
  }
});

export const registerApi = createAsyncThunk('auth/register', async ({ state, dispatch, navigate }) => {
  try {
    const response = await post('/auth/signup', state);

    if (response.isSuccess) {
      dispatch(activeSnack({ type: 'success', message: response.message }));
      navigate('/auth/login', { replace: true });
      return response?.user;
    }

    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
    throw error?.response?.data?.error;
  }
});

export const getAuthenticatedUserApi = createAsyncThunk('auth/profile', async (dispatch) => {
  try {
    const response = await get('/auth/profile');
    if (response.isSuccess) {
      return response?.user;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
    throw error?.response?.data?.error;
  }
});

export const logoutApi = createAsyncThunk('auth/logout', async ({ dispatch, navigate }) => {
  try {
    const response = await post('/auth/logout');
    if (response?.isSuccess) {
      sessionStorage.clear();
      dispatch(activeSnack({ type: 'success', message: response?.message }));
      navigate('/', { replace: true });
      return response;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    sessionStorage.clear();
    navigate('/', { replace: true });
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error }));
    throw error?.response?.data?.error;
  }
});
