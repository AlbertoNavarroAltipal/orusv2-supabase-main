import React from 'react';

interface PageSubheaderProps {
  title: string;
  children?: React.ReactNode;
}

const PageSubheader: React.FC<PageSubheaderProps> = ({ title, children }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-600">{title}</h1>
        </div>
        {children && <div className="flex items-center gap-4">{children}</div>}
      </div>
    </header>
  );
};

export default PageSubheader;