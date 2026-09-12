export default function Spinner({ size = 24, color = '#3D7EFF' }) {
  return (
    <div className="flex items-center justify-center py-12">
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        className="animate-spin"
      >
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    </div>
  )
}

export function PageSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center bg-bg-base">
      <Spinner size={32} />
    </div>
  )
}
