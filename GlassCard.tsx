import { ReactNode, CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export function GlassCard({ children, className, hover = false, style }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "glass rounded-2xl p-6",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
