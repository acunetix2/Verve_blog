import React, { useState } from 'react';

interface CourseImageProps {
  courseId: string;
  courseTitle: string;
  imageUrl?: string;
  className?: string;
  alt?: string;
}

export const CourseImage: React.FC<CourseImageProps> = ({
  courseId,
  courseTitle,
  imageUrl,
  className = 'w-full h-full object-cover',
  alt = 'Course image'
}) => {
  const [error, setError] = useState(false);

  const handleImageError = () => {
    setError(true);
  };

  if (error || !imageUrl) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center`}>
        <svg className="w-1/3 h-1/3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={handleImageError}
      loading="lazy"
    />
  );
};

export default CourseImage;
