import { configureStore } from '@reduxjs/toolkit';

// Import all your reducers
import userReducer from './userRelated/userSlice';
import studentReducer from './studentRelated/studentSlice';
import teacherReducer from './teacherRelated/teacherSlice';
import noticeReducer from './noticeRelated/noticeSlice';
import sclassReducer from './sclassRelated/sclassSlice';
import complainReducer from './complainRelated/complainSlice';

// Combine all reducers into a single root reducer object
const rootReducer = {
  user: userReducer,
  student: studentReducer,
  teacher: teacherReducer,
  notice: noticeReducer,
  sclass: sclassReducer,
  complain: complainReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  // Optional: Add middleware for development (e.g., logger)
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Export the types for use in your components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;