const Input = ({
  label,
  error,
  type = "text",
  placeholder,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        className="input-field"
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-rose-400">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;