import { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
type DeveloperThemeContextType = {
  isDeveloperTheme: boolean;
  toggleTheme: () => void;
};

// Create the context with a default value
const DeveloperThemeContext = createContext<DeveloperThemeContextType | null>(null);

// Add proper typing for children
interface DeveloperThemeProviderProps {
  children: ReactNode;
}

export const DeveloperThemeProvider = ({ children }: DeveloperThemeProviderProps) => {
  const [isDeveloperTheme, setIsDeveloperTheme] = useState(false);

  const toggleTheme = () => {
    setIsDeveloperTheme((prev) => !prev);
  };

  return (
    <DeveloperThemeContext.Provider value={{ isDeveloperTheme, toggleTheme }}>
      {children}
    </DeveloperThemeContext.Provider>
  );
};

export const useDeveloperTheme = (): DeveloperThemeContextType => {
  const context = useContext(DeveloperThemeContext);

  if (!context) {
    throw new Error("useDeveloperTheme must be used within a DeveloperThemeProvider");
  }

  return context;
};