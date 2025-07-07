// Import motion from Framer Motion for animation effects
import { motion } from "framer-motion";

/**
 * Reusable animated Button component.
 *
 * Props:
 * - children: The content inside the button.
 * - variant: Visual style of the button ("kiwi" or "outline").
 * - onClick: Function to call when the button is clicked.
 * - disabled: If true, disables the button.
 * - className: Additional Tailwind CSS classes for customization.
 */
const Button = ({
  children,
  variant = "kiwi",
  onClick,
  disabled,
  className,
}) => {
  // Define Tailwind-based style variants
  const variants = {
    kiwi: "bg-kiwi-700 text-white hover:bg-kiwi-800",
    outline: "border border-gray-300 text-gray-900 hover:bg-gray-100",
  };

  return (
    <motion.button
      // Compose base, variant, and custom styles with disabled styling
      className={`px-4 py-2 rounded-lg ${variants[variant]} disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
      // Animation when hovering and clicking the button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;
