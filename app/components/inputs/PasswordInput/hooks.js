import { useState } from "react";

export function usePasswordInput() {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((show) => !show);
  return {
    isPasswordVisible,
    togglePasswordVisibility
  };
}
