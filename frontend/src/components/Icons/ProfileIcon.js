import React from "react";

export default function ProfileIcon(props) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <circle cx="12" cy="7" r="5" fill="currentColor" />
      <path
        d="M12 16C16 16 18 17.39 18 19H6c0-1.61 2-3 6-3Z"
        fill="currentColor"
      />
    </svg>
  );
}
