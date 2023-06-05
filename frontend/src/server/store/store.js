import { configureStore } from '@reduxjs/toolkit';
import commonReducer from './common';
import authReducer from './auth';
import userReducer from './users';
import kuriReducer from './kuri';

export default configureStore({
  reducer: {
    common: commonReducer,
    auth: authReducer,
    users: userReducer,
    kuri: kuriReducer,
  },
});
