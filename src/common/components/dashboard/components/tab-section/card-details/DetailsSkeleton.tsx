import React from "react";

const SkeletonBlock: React.FC<{ width?: string | number; height?: string | number; className?: string }> = ({
  width = "100%",
  height = "1rem",
  className = "",
}) => (
  <div
    className={`bg-gray-200 rounded ${className} animate-pulse`}
    style={{ width, height }}
  />
);

const DetailsSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-center gap-4">
          <SkeletonBlock width={40} height={40} className="rounded-lg" />
          <div className="space-y-2 flex-1">
            <SkeletonBlock width={192} height={32} className="rounded" />
            <SkeletonBlock width={256} height={16} className="rounded" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <SkeletonBlock key={i} height={96} className="rounded-lg" />
              ))}
            </div>

            <SkeletonBlock height={40} className="rounded-lg" />

            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonBlock key={i} height={48} className="rounded" />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsSkeleton;