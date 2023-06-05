import { createAsyncThunk } from '@reduxjs/toolkit';
import { activeSnack } from '../store/common';
import { del, get, post, put } from './http';

export const getAllKuri = createAsyncThunk('kuri/list', async ({ limit, search, dispatch }) => {
  try {
    const response = await get(`/kuri?limit=${limit && limit}&search=${search && search}`);
    if (response?.isSuccess) {
      return response;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error || 'something went wrong' }));
    throw error?.response?.data?.error;
  }
});

// export const getKuriDetails = createAsyncThunk('kuris/single', async ({ kuriId, dispatch }) => {
//   try {
//     const response = await get(`/admin/kuri/${kuriId}`);
//     if (response.isSuccess) {
//       return response?.kuri;
//     }
//     return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
//   } catch (error) {
//     dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error || 'something went wrong' }));
//     throw error?.response?.data?.error;
//   }
// });

export const createKuri = createAsyncThunk('kuri/create', async ({ state, dispatch, handleClose }) => {
  try {
    const response = await post(`/kuri`, state);
    if (response?.isSuccess) {
      handleClose();
      dispatch(activeSnack({ type: 'success', message: response?.message }));
      return response?.kuri;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error || 'something went wrong' }));
    throw error?.response?.data?.error;
  }
});

export const updateKuriDetails = createAsyncThunk('kuri/update', async ({ state, kuriId, dispatch }) => {
  try {
    const response = await put(`/kuri/${kuriId}`, state);
    if (response.isSuccess) {
      dispatch(activeSnack({ type: 'success', message: response?.message }));
      return response?.kuri;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error || 'something went wrong' }));
    throw error?.response?.data?.error;
  }
});

export const deleteKuri = createAsyncThunk('kuri/delete', async ({ kuriId, dispatch, handleCloseDeleteDialog }) => {
  console.log(kuriId);
  try {
    const response = await del(`/kuri/${kuriId}`);
    if (response.isSuccess) {
      handleCloseDeleteDialog();
      dispatch(activeSnack({ type: 'success', message: response?.message }));
      return response?.kuriId;
    }
    return dispatch(activeSnack({ type: 'error', message: 'something went wrong' }));
  } catch (error) {
    dispatch(activeSnack({ type: 'error', message: error?.response?.data?.error || 'something went wrong' }));
    throw error?.response?.data?.error;
  }
});
