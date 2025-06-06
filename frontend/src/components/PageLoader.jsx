import { LoaderIcon } from 'lucide-react';
import React from 'react'
import { useThemeStore } from '../stores/useThemeStore';

const PageLoader = () => {
  const {theme} = useThemeStore();
  return (
    <div className="min-h-screen flex items-center justify-center" data-theme={theme}>
      <LoaderIcon className="animate-spin size-12 text-primary" />
    </div>
  );
};

export default PageLoader;