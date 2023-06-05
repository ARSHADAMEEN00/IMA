import { createSlice } from '@reduxjs/toolkit';

export const commonSlice = createSlice({
  name: 'login',
  initialState: {
    loading: false,
    error: '',
    snack: {
      type: '',
      status: false,
      position: {
        vertical: 'top',
        horizontal: 'center',
      },
      message: '',
    },
  },
  reducers: {
    activeSnack: (state, action) => {
      state.snack.status = true;
      state.snack.type = action.payload.type;
      state.snack.message = action.payload.message;
    },
    hideSnack: (state) => {
      state.snack.status = false;
    },
  },
});
export const { activeSnack, hideSnack } = commonSlice.actions;

export default commonSlice.reducer;
