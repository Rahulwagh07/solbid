export function SolbidLogo({
  className,
  innerColor = "#000000",
}: {
  className?: string;
  innerColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="4" fill="currentColor" />
      <rect x="8" y="8" width="8" height="8" rx="1" fill={innerColor} />
    </svg>
  );
}
