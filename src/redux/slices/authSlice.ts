import { createSlice} from '@reduxjs/toolkit';

const getSafeStorage = (key: string) => {
  const value = localStorage.getItem(key);
  if (!value || value === "undefined" || value === "null") return null;
  return value;
};

const initialState = {
  user: JSON.parse(getSafeStorage("user") || "null"),
  accessToken: getSafeStorage("accessToken"),
  role: getSafeStorage("role"),
  loading: false
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;

      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
      if (action.payload.accessToken) {
        localStorage.setItem("accessToken", action.payload.accessToken);
      }
      if (action.payload.role) {
        localStorage.setItem("role", action.payload.role);
      }
    },
    clearAuth: (state) => {
      state.accessToken = null;
      state.role = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    }
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;

