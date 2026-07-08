import { motion } from 'framer-motion';
import clsx from 'clsx';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all',
  ghost: 'px-5 py-2.5 rounded-xl hover:bg-surface-light text-gray-300 hover:text-white transition-all',
};

const Button = ({ children, variant = 'primary', loading = false, className = '', icon, ...props }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={clsx(variants[variant], 'inline-flex items-center justify-center gap-2', className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  );
};

export default Button;
