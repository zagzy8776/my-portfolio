import { fallbackImage } from '../data/journal'

interface CoverImageProps {
  /** WebP path; the matching `.jpg` is used as a `<picture>` fallback. */
  src: string
  alt: string
  width: number
  height: number
  className?: string
  /** Only the first card or two above the fold should be eager. */
  loading?: 'eager' | 'lazy'
}

/**
 * Journal cover art.
 *
 * Covers are real photography (Wikimedia Commons) exported as WebP with a JPEG
 * beside it, so this renders a `<picture>` rather than a bare `<img>`. Width and
 * height are always supplied from the entry data — that is what stops the card
 * grid reflowing as ten images of differing intrinsic sizes load in.
 *
 * The entry's stored `image` ends in `.webp`; `fallbackImage()` derives the
 * sibling `.jpg`, so a cover cannot ship with only one of the two formats.
 */
export default function CoverImage({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
}: CoverImageProps) {
  const jpeg = fallbackImage(src)

  return (
    <picture>
      <source srcSet={src} type="image/webp" />
      <img
        src={jpeg ?? src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
