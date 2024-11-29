import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-16 sm:top-20 md:top-32 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-red-100 text-red-700 rounded-lg shadow-lg z-50 max-w-[90vw] sm:max-w-md text-center"
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
};

export default ErrorMessage;