import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { checkDatabase as checkDatabaseAPI, initDatabase as initDatabaseAPI, login as loginAPI } from './api';

export type UserState = {
  hasInit: Boolean;
  hasLogin: Boolean;
  loginFailed: Boolean;
  secret: string;
};

const initialState: UserState = {
  hasInit: false,
  hasLogin: false,
  loginFailed: false,
  secret: "",
};

export const checkDatabase = createAsyncThunk(
  'system/checkDatabase',
  async () => {
    const hasInit = await checkDatabaseAPI();
    return hasInit;
  }
);
export const initDatabase = createAsyncThunk(
  'system/initDatabase',
  async (password: string) => {
    await initDatabaseAPI(password);
  }
);
export const login = createAsyncThunk(
  'system/login',
  async (password: string) => {
    const success = await loginAPI(password);
    return success;
  }
);

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => builder
    .addCase(checkDatabase.fulfilled, (state, action) => {
      state.hasInit = action.payload;
    })
    .addCase(initDatabase.fulfilled, (state, action) => {
      state.hasInit = true;
      state.hasLogin = true;
      state.secret = action.meta.arg;
    })
    .addCase(login.fulfilled, (state, action) => {
      const success = action.payload;
      state.hasLogin = success;
      state.loginFailed = !success;
      if (success) {
        state.secret = action.meta.arg;
      }
    })
});

export const { logout } = systemSlice.actions;

export default systemSlice.reducer;
