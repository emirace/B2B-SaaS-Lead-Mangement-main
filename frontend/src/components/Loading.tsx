import React from "react";

interface Props {
  color?: string;
  size?: "sm" | "md" | "lg";
}

const Loading: React.FC<Props> = ({ color = "primary", size = "md" }) => {
  // Define classes based on the color and size props
  const colorClass = `border-${color}`;
  const sizeClass =
    size === "sm" ? "h-6 w-6" : size === "lg" ? "h-24 w-24" : "h-14 w-14";

  return (
    <div
      className={`animate-spin rounded-full ${sizeClass} ${colorClass} border-t-2 border-solid`}
    />
  );
};

export default Loading;
