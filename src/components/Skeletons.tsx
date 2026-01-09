import React from "react";

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{
            width: i === lines - 1 ? "80%" : "100%",
          }}
        />
      ))}
    </div>
  );
};

export const SkeletonImage: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 ${className}`}
    >
      <SkeletonImage className="h-40 w-full" />
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1 animate-pulse" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1 animate-pulse" />
      </div>
    </div>
  );
};

export const SkeletonBlogCard: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4 ${className}`}
    >
      <SkeletonText lines={1} />
      <SkeletonText lines={2} className="pt-2" />
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <SkeletonText lines={1} className="w-24" />
        </div>
        <SkeletonText lines={1} className="w-20" />
      </div>
    </div>
  );
};

export const SkeletonDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl h-40 animate-pulse" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Reading Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white dark:bg-gray-800 rounded-xl">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-6 border-b border-gray-200 dark:border-gray-700 last:border-0 space-y-3"
          >
            <SkeletonText lines={1} />
            <SkeletonText lines={1} className="w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonPostList: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBlogCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonSearchResults: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
          <SkeletonText lines={2} />
        </div>
      ))}
    </div>
  );
};
