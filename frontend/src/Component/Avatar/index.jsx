import { useState } from "react";
import { getImageUrl } from "@/config";

function getInitials(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Production-safe avatar: shows image from DB when URL loads, otherwise initials (no broken icon).
 */
export default function Avatar({
  src,
  name,
  className = "",
  initialClassName = "",
  onClick,
  alt = "Profile",
  "aria-label": ariaLabel,
}) {
  const imageUrl = getImageUrl(src);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = imageUrl && !imageFailed;

  if (showImage) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={className}
        onClick={onClick}
        onError={() => setImageFailed(true)}
        role={onClick ? "button" : undefined}
        aria-label={ariaLabel}
      />
    );
  }

  return (
    <div
      className={initialClassName || className}
      onClick={onClick}
      role={onClick ? "img" : undefined}
      aria-label={ariaLabel || name}
    >
      {getInitials(name)}
    </div>
  );
}
