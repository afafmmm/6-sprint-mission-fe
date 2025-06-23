"use client";

import { authPandaService as authService } from "@/lib/authService";
import { userPandaService as userService } from "@/lib/userService";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: async (email, password) => {},
  logout: async () => {},

  register: async (nickname, email, password, passwordConfirmation) => {},
  updateUser: async (userData) => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await userService.getMe();
      setUser(currentUser);
    } catch (error) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (nickname, email, password, passwordConfirmation) => {
      try {
        await authService.signUp(
          nickname,
          email,
          password,
          passwordConfirmation
        );
        console.log("회원가입 성공");
      } catch (error) {
        console.error("회원가입 실패:", error);
        throw error;
      }
    },
    []
  );

  const login = useCallback(
    async (email, password) => {
      try {
        await authService.signIn(email, password);
        await getUser();
      } catch (error) {
        console.error("로그인 실패:", error);
        setUser(null);
        throw error;
      }
    },
    [getUser]
  );

  const logout = useCallback(async () => {
    try {
      await authService.signOut();
      setUser(null);
      console.log("로그아웃 성공");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      throw error;
    }
  }, []);

  const updateUser = useCallback(async (userData) => {
    try {
      const updatedUser = await userService.updateMe(userData);
      setUser(updatedUser);
      console.log("사용자 정보 업데이트 성공");
      return updatedUser;
    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const value = {
    user,
    isLoading,
    login,
    logout,
    register,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
