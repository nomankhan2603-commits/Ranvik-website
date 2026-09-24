import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../config/siteConfig';

export interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light'; // 'dark' = for light backgrounds (header); 'light' = for dark backgrounds (footer)
  context?: 'header' | 'footer' | 'default';
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant,
  context = 'default',
  onClick,
}) => {
  const [cacheBust, setCacheBust] = useState<number>(Date.now());
  const [imgFailed, setImgFailed] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use dedicated clean transparent logo asset
  const baseLogoSrc =
    context === 'header'
      ? (siteConfig.logo?.headerSrc || '/assets/ranvik-logo-clean-transparent.png')
      : context === 'footer'
      ? (siteConfig.logo?.footerSrc || '/assets/ranvik-logo-clean-transparent.png')
      : (siteConfig.logo?.src || '/assets/ranvik-logo-clean-transparent.png');

  const logoSrc = `${baseLogoSrc}?v=${cacheBust}`;
  const brandName = siteConfig.brandName || 'RANVIK';
  const logoAlt = siteConfig.logo?.alt || 'RANVIK Leather Military Boots';

  // Reset error state if logo path changes
  useEffect(() => {
    setImgFailed(false);
  }, [baseLogoSrc]);

  // Determine variant based on explicit prop or context
  const resolvedVariant = variant || (context === 'footer' ? 'light' : 'dark');

  // Text fallback typography sizes
  const textSizeClasses = {
    sm: 'text-lg sm:text-xl tracking-[0.2em]',
    md: 'text-2xl sm:text-3xl tracking-[0.25em]',
    lg: 'text-3xl sm:text-4xl lg:text-5xl tracking-[0.3em]',
    xl: 'text-4xl sm:text-5xl lg:text-6xl tracking-[0.35em]',
  };

  // Image sizing constraints:
  // Header: width approximately 165px on desktop, responsive on mobile (130px-145px), object-contain
  // Footer: width approximately 190px, maintain aspect ratio, object-contain
  const resolvedImageClasses =
    context === 'header'
      ? 'h-9 sm:h-10 md:h-12 w-auto max-w-[210px] object-contain block shrink-0'
      : context === 'footer'
      ? 'h-11 sm:h-13 md:h-14 w-auto max-w-[230px] object-contain block shrink-0'
      : 'h-9 sm:h-10 md:h-12 w-auto max-w-[210px] object-contain block shrink-0';

  const textColor = resolvedVariant === 'light' ? 'text-white' : 'text-[#181818]';
  const dotColor = 'bg-[#B83A2A]';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  // Direct file upload handler to save exact attached file
  const handleUploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const targetParam = context === 'header' ? 'header' : context === 'footer' ? 'footer' : 'main';
      const arrayBuffer = await file.arrayBuffer();

      const res = await fetch(`/api/upload-logo?target=${targetParam}`, {
        method: 'POST',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: arrayBuffer,
      });

      if (res.ok) {
        setCacheBust(Date.now());
        setImgFailed(false);
        setUploadNotice('Logo updated!');
        setTimeout(() => setUploadNotice(null), 3000);
      } else {
        setUploadNotice('Upload error');
        setTimeout(() => setUploadNotice(null), 3000);
      }
    } catch (err) {
      console.error('Failed to upload logo:', err);
      setUploadNotice('Upload failed');
      setTimeout(() => setUploadNotice(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleUploadFile(file);
      }
    }
  };

  const content = (
    <div
      className="relative group inline-flex items-center"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {!imgFailed && baseLogoSrc ? (
        <img
          id={
            context === 'header'
              ? 'ranvik-header-logo-image'
              : context === 'footer'
              ? 'ranvik-footer-logo-image'
              : 'brand-logo-image'
          }
          src={logoSrc}
          alt={logoAlt}
          title="Drag & drop or double-click to upload custom logo file"
          onDoubleClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          onError={() => setImgFailed(true)}
          onLoad={() => setImgFailed(false)}
          className={resolvedImageClasses}
          style={{ objectFit: 'contain' }}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      ) : (
        /* Text Fallback: RANVIK */
        <div id="brand-logo-fallback" className="flex items-center gap-1.5">
          <span
            className={`font-condensed font-black uppercase ${textColor} leading-none ${textSizeClasses[size]}`}
            style={{ letterSpacing: '0.22em' }}
          >
            {brandName}
          </span>
          <span
            className={`h-1.5 w-1.5 rounded-full ${dotColor} inline-block mb-0.5`}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Hidden file input allowing direct upload of exact logo files */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleUploadFile(e.target.files[0]);
          }
        }}
      />

      {/* Floating change-logo button on hover */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        title="Upload your exact original logo file (PNG or JPG)"
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute -bottom-2 -right-2 bg-[#181818] hover:bg-[#B83A2A] text-white p-1 rounded-full shadow-lg z-40 flex items-center justify-center text-[10px] border border-white/20"
        aria-label="Upload custom logo file"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Upload toast feedback */}
      {uploadNotice && (
        <div className="absolute -bottom-6 left-0 bg-[#181818] text-white text-[10px] font-mono px-2 py-0.5 rounded shadow z-50 whitespace-nowrap">
          {uploadNotice}
        </div>
      )}
    </div>
  );

  // In header context, render cleanly without background containers against the light header
  if (context === 'header') {
    return (
      <a
        href="/"
        id="ranvik-header-logo-link"
        className={`header-logo inline-flex items-center select-none ${className}`}
        onClick={handleClick}
        aria-label={logoAlt}
      >
        {content}
      </a>
    );
  }

  // In footer context, render cleanly without background containers
  if (context === 'footer') {
    return (
      <a
        href="/"
        id="ranvik-footer-logo-link"
        className={`footer-logo inline-flex items-center select-none ${className}`}
        onClick={handleClick}
        aria-label={logoAlt}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      id={`brand-logo-${context}`}
      onClick={handleClick}
      className={`inline-flex items-center justify-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {content}
    </div>
  );
};
