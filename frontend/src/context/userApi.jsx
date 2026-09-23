import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

const UserContext = createContext(null);

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const token = Cookies.get("token");
    if (!token) {
      setUser(null);
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get("/api/employee/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(data?.data || null);
      setIsAuth(true);
    } catch (error) {
      Cookies.remove("token");
      setUser(null);
      setIsAuth(false);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    toast.success("User logged Out");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    setUser,
    isAuth,
    setIsAuth,
    loading,
    setLoading,
    fetchUser,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default ContextProvider;

export const useAppData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAppData must be used within ContextProvider");
  }
  return context;
};


