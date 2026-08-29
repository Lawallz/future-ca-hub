import { useState } from "react";
import { Shimmer } from "./Skeletons";

type Props = {
  /** Fallback source (jpg/png) used when AVIF/WebP are unsupported. */
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  /** Responsive srcsets, e.g. `import img from "./x.jpg?format=avif&w=480;960&as=srcset"`. */
  avifSrcSet?: string;
  webpSrcSet?: string;
  srcSet?: string;
  /** Layout hint for the browser, e.g. "(min-width: 1024px) 33vw, 100vw". */
  sizes?: string;
  priority?: boolean;
};

/**
 * Image with modern formats (AVIF → WebP → original), responsive sources and
 * a skeleton placeholder that fades out once the file is decoded.
 */
export function ProgressiveImage({
  src,
  alt,
  className = "",
  width,
  height,
  avifSrcSet,
  webpSrcSet,
  srcSet,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {!loaded && <Shimmer className="absolute inset-0 h-full w-full rounded-[inherit]" />}
      <picture>
        {avifSrcSet && <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />}
        {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />}
        <img
          src={src}
          srcSet={srcSet}
          sizes={srcSet || avifSrcSet || webpSrcSet ? sizes : undefined}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-fluid)] ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </picture>
    </span>
  );
}
