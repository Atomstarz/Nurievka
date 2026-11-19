import React, { Suspense } from 'react';
import SkeletonLoader from './SkeletonLoader';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
  loadingText?: string;
  skeleton?: 'card' | 'list' | 'text' | 'avatar' | 'post';
  skeletonCount?: number;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  children,
  fallback,
  className = '',
  loadingText = 'Загрузка...', // <--- ИСПРАВЛЕНО
  skeleton,
  skeletonCount = 3
}) => {
  const defaultFallback = skeleton ? (
    <div className={`py-8 ${className}`}>
    <SkeletonLoader variant={skeleton} count={skeletonCount} />
    </div>
  ) : (
    <div className={`flex items-center justify-center py-12 min-h-[50vh] ${className}`}>
    <div className="text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mx-auto mb-4"></div>
    <p className="text-slate-400">{loadingText}</p>
    </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
    {children}
    </Suspense>
  );
};

export default SuspenseWrapper;
