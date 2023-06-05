import { createSlice } from '@reduxjs/toolkit';
import { covertToJSON } from '../../utils/stateToJson';
import { createKuri, deleteKuri, getAllKuri, updateKuriDetails } from '../api/kuri';
// import { createService, deleteService, getAllKuri, getServiceDetails, updateServiceDetails } from '../api/kuri';

export const kuriSlice = createSlice({
  name: 'kuri',
  initialState: {
    loading: false,
    getLoading: false,
    error: {},
    kuriList: {},
    kuriDetails: {},
  },
  reducers: {},
  extraReducers: {
    //  getAllServices
    [getAllKuri.pending]: (state) => {
      state.getLoading = true;
    },
    [getAllKuri.fulfilled]: (state, action) => {
      state.getLoading = false;
      state.kuriList = action.payload;
    },
    [getAllKuri.rejected]: (state, action) => {
      state.getLoading = false;
      state.error = action.error;
    },

    // // get single user details
    // [getServiceDetails.pending]: (state) => {
    //   state.loading = true;
    // },
    // [getServiceDetails.fulfilled]: (state, action) => {
    //   state.loading = false;
    //   state.kuriDetails = action.payload;
    // },
    // [getServiceDetails.rejected]: (state, action) => {
    //   state.loading = false;
    //   state.error = action.error;
    // },

    // create createKuri
    [createKuri.pending]: (state) => {
      state.loading = true;
    },
    [createKuri.fulfilled]: (state, action) => {
      const jsonState = covertToJSON(state)?.kuriList;
      const modifiedServicesList = {
        ...jsonState,
        list: [action.payload, ...jsonState.list],
      };
      state.loading = false;
      state.kuriDetails = action.payload;
      state.kuriList = modifiedServicesList;
      state.error = {};
    },
    [createKuri.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // update updateKuriDetails
    [updateKuriDetails.pending]: (state) => {
      state.loading = true;
    },
    [updateKuriDetails.fulfilled]: (state, action) => {
      const jsonState = covertToJSON(state)?.kuriList;
      const modifiedKuriList = {
        ...jsonState,
        list: jsonState.list?.map((kuri) => (kuri?._id === action.payload?._id ? action.payload : kuri)),
      };
      state.loading = false;
      state.kuriDetails = action.payload;
      state.kuriList = modifiedKuriList;
      state.error = {};
    },
    [updateKuriDetails.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },

    // // delete kuri
    [deleteKuri.pending]: (state) => {
      state.loading = true;
    },
    [deleteKuri.fulfilled]: (state, action) => {
      const jsonState = covertToJSON(state)?.kuriList;
      const modifiedKuriList = {
        ...jsonState,
        list: jsonState.list?.filter((kuri) => kuri?._id !== action.payload),
      };
      state.loading = false;
      state.kuriList = modifiedKuriList;
      state.error = {};
    },
    [deleteKuri.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error;
    },
  },
});
// export const {} = authSlice.actions;

export default kuriSlice.reducer;
