import { configureStore } from '@reduxjs/toolkit'
import  authreducer  from './reducer/authreducer';
import postreducer from './reducer/postreducer';
export const store = configureStore({
  reducer: {
    auth:authreducer, 
    postsreducer:postreducer,
  },
});