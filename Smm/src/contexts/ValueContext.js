import React, { createContext, useContext, useState, useEffect } from "react";

const ValueContext = createContext();

export function ValueProvider({ children }) {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    const storedUserId = localStorage.getItem("userId");

    if (storedUserType && storedUserId) {
      setUserType(storedUserType);
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userType && userId) {
      localStorage.setItem("userType", userType);
      localStorage.setItem("userId", userId);
    }
  }, [userType, userId]);

  return (
    <ValueContext.Provider value={{ userType, setUserType, userId, setUserId }}>
      {children}
    </ValueContext.Provider>
  );
}

export function useValue() {
  return useContext(ValueContext);
}
