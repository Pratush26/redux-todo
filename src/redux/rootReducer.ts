import { combineReducers } from "@reduxjs/toolkit";
import todoReducer from './features/todo'

export const rootReducer = combineReducers({
  todo: todoReducer,
});
