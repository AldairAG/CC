import React from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  label?: string;
  classNameInput?: string;
  classNameDiv?: string;
  name?: string;
  classNameError?: string;
}

/**
 * A reusable input component built with React and TypeScript, supporting custom styles, labels, and error messages.
 *
 * @component
 * @template InputProps - The props type for the input component.
 * @param {string} id - The unique identifier for the input element.
 * @param {string} [label] - The optional label text for the input element.
 * @param {string} [classNameDiv] - Additional CSS classes for the wrapper `<div>` element.
 * @param {string} [classNameInput] - Additional CSS classes for the `<input>` element.
 * @param {string} [classNameError] - Additional CSS classes for the error message element.
 * @param {string} [name] - The name of the field (required for error handling).
 * @param {React.Ref<HTMLInputElement>} ref - A forwarded ref for the input element.
 * @param {React.InputHTMLAttributes<HTMLInputElement>} props - Additional props for the input element.
 * @returns {JSX.Element} A styled input component with optional label, error message and customizable styles.
 *
 * @example
 * ```tsx
 * <Input
 *   id="username"
 *   name="username"
 *   label="Username"
 *   classNameDiv="custom-div-class"
 *   classNameInput="custom-input-class"
 *   classNameError="text-red-500"
 *   placeholder="Enter your username"
 * />
 * ```
 */
const InputTemplate = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, classNameDiv, classNameInput, name, ...props }, ref) => {
    return (
      <div className={twMerge("", classNameDiv)}>
        {label && <label htmlFor={id}>{label}</label>}
        <input
          id={id}
          name={name}
          {...props}
          ref={ref}
          className={twMerge(
            "input",
            classNameInput
          )}
        />
      </div>
    );
  }
);

export default InputTemplate;