'use client';

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@components/ui/card";
import { CardContent } from "@components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  testId: string;
}

export function CollapsibleSection({ title, icon, isOpen, onToggle, children, testId }: CollapsibleSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <button
          type="button"
          onClick={onToggle}
          className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-muted/30 transition-colors"
          data-testid={`section-toggle-${testId}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
              {icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CardContent className="pt-0 px-4 sm:px-6 pb-6">
                {children}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
