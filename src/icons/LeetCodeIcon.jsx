const LeetCodeIcon = ({ size = 20, stroke = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 4L8 11L15 18" />
    <path d="M19 11H8" />
  </svg>
);

export default LeetCodeIcon;
