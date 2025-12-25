// components/AppAnimatedTabPanel.tsx
import { Box } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

export const AppAnimatedTabPanel = ({ value, index, children }: any) => {
  const active = value === index;

  return (
    <AnimatePresence mode="wait">
      {active && (
        <Box
          component={motion.div}
          key={index}
          role="tabpanel"
          id={`tabpanel-${index}`}
          aria-labelledby={`tab-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          sx={{ pt: 2 }}
        >
          {children}
        </Box>
      )}
    </AnimatePresence>
  );
};
