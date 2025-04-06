
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ScrollAreaFixedProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

const ScrollAreaFixed: React.FC<ScrollAreaFixedProps> = ({ 
  children, 
  className,
  orientation = 'horizontal' 
}) => {
  return (
    <ScrollArea className={className}>
      {children}
      <ScrollBar orientation={orientation} />
    </ScrollArea>
  );
};

export default ScrollAreaFixed;
