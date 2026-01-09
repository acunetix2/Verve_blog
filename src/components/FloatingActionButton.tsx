import React, { useState } from "react";
import { Plus, Pen, Search, MessageSquare, Share2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Pen size={20} />,
      label: "Write Post",
      onClick: () => {
        navigate("/v/create");
        setIsOpen(false);
      },
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Search size={20} />,
      label: "Search",
      onClick: () => {
        // Trigger search modal with Cmd+K
        const event = new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
        });
        window.dispatchEvent(event);
        setIsOpen(false);
      },
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Feedback",
      onClick: () => {
        // Open feedback modal
        alert("Feedback feature coming soon!");
        setIsOpen(false);
      },
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 z-40"
          />
        )}
      </AnimatePresence>

      {/* FAB Actions */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end gap-4 z-50">
        <AnimatePresence>
          {isOpen &&
            actions.map((action, idx) => (
              <motion.button
                key={idx}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 20 }}
                transition={{ delay: idx * 0.1 }}
                onClick={action.onClick}
                className="group flex items-center gap-3"
              >
                {/* Label */}
                <div className="bg-gray-900 dark:bg-gray-800 text-white px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  {action.label}
                </div>

                {/* Button */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gradient-to-br ${action.color} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow`}
                >
                  {action.icon}
                </motion.div>
              </motion.button>
            ))}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-shadow z-50"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="plus"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Plus size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};

export default FloatingActionButton;
