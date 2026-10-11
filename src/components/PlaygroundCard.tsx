import { fallbackImage } from '../data/explorations'

interface PlaygroundCardProps {
  /** WebP path; the matching `.jpg` is used as a `<picture>` fallback. */
  src: string
  alt: string
  /** Intrinsic size, required so the square grid cannot reflow as images load. */
  width: number
  height: number
  className?: string
}

/**
 * Visual-playground card art.
 *
 * Mirrors `CoverImage` for the 1:1 playground plates: a `<picture>` with a WebP
 * source and a JPEG fallback, plus explicit `width`/`height` from the data so
 * the six square cards do not shift the parallax columns as they decode.
 */
export default function PlaygroundCard({
  src,
  alt,
  width,
  height,
  className,
}: PlaygroundCardProps) {
  const jpeg = fallbackImage(src)

  return (
    <picture>
      <source srcSet={src} type="image/webp" />
      <img
        src={jpeg ?? src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
      />
    </picture>
  )
}
