import { configureStore, combineReducers, ThunkAction, Action } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import systemReducer from '../features/system/slice';
import contactReducer from '../features/contact/slice';

export const history = createBrowserHistory({ basename: process.env.PUBLIC_URL });

export const rootReducer = combineReducers({
  router: connectRouter(history),
  system: systemReducer,
  contact: contactReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware(history)),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
