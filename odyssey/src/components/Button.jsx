import React from "react";
import "./Button.css";
import { Link } from "react-router-dom";

// Define the possible styles and sizes for the button
const STYLES = ["btn-primary", "btn--outline"];
const SIZES = ["btn--medium", "btn--large"];

// Create the Button component
export const Button = ({
  children,
  type,
  onClick,
  buttonStyle,
  buttonSize,
}) => {
  // Check if the button style and size passed in are valid, otherwise use the defaults
  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle
    : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  // Render the button with the appropriate style, size, onClick function, and child content
  return (
    <Link to="/" className="btn-mobile">
      <button
        className={`btnHome ${checkButtonStyle} ${checkButtonSize}`}
        onClick={onClick}
        type={type}
      >
        {children}
      </button>
    </Link>
  );
};

export default Button;
