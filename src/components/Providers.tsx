import { createContext, useEffect, useRef, useState, useContext } from "react";
import { ModalProvider } from "@/components/ModalContext";
import { ModalContainer } from "@/components/ModalContainer";

function usePrevious<T>(value: T) {
  let ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Theme context
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  resolvedTheme: string;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function useTheme() {
  return useContext(ThemeContext);
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    // Get saved theme or default to system
    const savedTheme = localStorage.getItem("theme") || "system";

    // Apply the theme
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const currentTheme = localStorage.getItem("theme") || "system";
      if (currentTheme === "system") {
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{ theme: "system", setTheme: () => {}, resolvedTheme: "light" }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider
      value={{ theme: "system", setTheme: () => {}, resolvedTheme: "light" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const AppContext = createContext<{ previousPathname?: string }>({});

export function Providers({ children }: { children: React.ReactNode }) {
  // In Astro, we don't have usePathname from Next.js, so we'll handle this differently
  // For now, we'll keep it simple without the pathname tracking
  let previousPathname = undefined;

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <ThemeProvider>
        <ModalProvider>
          {children}
          <ModalContainer />
        </ModalProvider>
      </ThemeProvider>
    </AppContext.Provider>
  );
}
