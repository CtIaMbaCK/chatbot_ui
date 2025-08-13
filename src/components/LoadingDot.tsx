'use client';

export default function LoadingDots({
  size = 6,
  gap = 4,
  color = 'bg-gray-600',
}) {
  const style = { width: size, height: size };

  return (
    <div
      className="flex "
      
      aria-label="Loading"
      role="status"
    >
      <div className="bg-[#c4c4c4] p-4 rounded-md flex" style={{ gap }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`${color} rounded-full animate-bounce-y`}
            style={{ ...style, animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
