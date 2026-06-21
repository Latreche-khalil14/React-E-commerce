import { createContext, useContext, useEffect, useReducer } from "react";
import { getMeApi } from "../api/auth.api";

const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };
    case "UPDATE_USER":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case "LOGOUT":
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return { user: null, token: null, loading: false, isAuthenticated: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Re-validate token on mount — only once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getMeApi()
      .then((res) => dispatch({ type: "UPDATE_USER", payload: res.data.user }))
      .catch(() => {
        // Token expired or invalid — clear silently
        dispatch({ type: "LOGOUT" });
      });
  }, []); // empty deps — runs once on mount only

  const login = (data) => dispatch({ type: "LOGIN_SUCCESS", payload: data });
  const logout = () => dispatch({ type: "LOGOUT" });
  const updateUser = (user) => dispatch({ type: "UPDATE_USER", payload: user });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
