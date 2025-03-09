
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn("w-9 h-9 rounded-full transition-all", className)}
    >
      <Sun className={cn("h-5 w-5 transition-all", theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100")} />
      <Moon className={cn("absolute h-5 w-5 transition-all", theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0")} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
