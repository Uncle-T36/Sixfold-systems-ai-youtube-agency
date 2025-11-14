import React, { ReactNode } from 'react';
import AppNavigation from './AppNavigation';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  currentPage?: string;
  showBack?: boolean;
}

/**
 * PageLayout - Wrapper component that fixes sidebar overlap
 * Automatically adds proper padding for desktop sidebar
 */
export default function PageLayout({ children, title, currentPage, showBack = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-slate-950">
      <AppNavigation title={title} currentPage={currentPage} showBack={showBack} />
      
      {/* Main content with proper padding for sidebar */}
      <div className="sm:pl-20 lg:pl-64 pt-4">
        {children}
      </div>
    </div>
  );
}
