import { configureStore } from '@reduxjs/toolkit';
import userReducer from './redux/userReducer';
import taskReducer from './redux/taskReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
  }
});

export default store;