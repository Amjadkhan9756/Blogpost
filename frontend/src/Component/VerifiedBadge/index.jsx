/** Blue verified badge for users with 600k+ total post likes */
export default function VerifiedBadge({ verified, className = "", size = 18 }) {
  if (!verified) return null;
  return (
    <span
      className={className}
      title="Verified (600k+ likes)"
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginLeft: "4px",
        verticalAlign: "middle",
      }}
      aria-label="Verified"
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#0ea5e9" />
        <path
          d="M8 12l3 3 5-6"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
