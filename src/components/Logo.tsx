import Image from 'next/image';
import { FileText } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12'
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl'
};

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const logoDimensions = {
    sm: { width: 120, height: 36 },
    md: { width: 160, height: 48 },
    lg: { width: 200, height: 60 }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Try to load custom logo first, fallback to icon */}
      <div className="relative">
        <Image
          src="/logo.svg"
          alt="ImagePDFly Logo"
          width={logoDimensions[size].width}
          height={logoDimensions[size].height}
          className="object-contain"
          onError={(e) => {
            // Fallback to icon if logo image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'block';
          }}
        />
        <div 
          className="hidden flex items-center"
          style={{ display: 'none' }}
        >
          <FileText className={`${sizeClasses[size]} text-red-500`} />
          {showText && (
            <span className={`ml-2 font-bold text-gray-900 ${textSizeClasses[size]}`}>
              ImagePDFly
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
