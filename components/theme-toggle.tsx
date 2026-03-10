"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@components/ui/button";
import { useTheme } from "@hooks/use-theme";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-md border border-border bg-background/50 backdrop-blur-sm hover:bg-accent/20"
      data-testid="button-theme-toggle"
      aria-label={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
    >
      {mounted ? (
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon className="h-4 w-4 text-primary" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: 90, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun className="h-4 w-4 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <Moon className="h-4 w-4 text-primary" />
      )}
    </Button>
  );
}
