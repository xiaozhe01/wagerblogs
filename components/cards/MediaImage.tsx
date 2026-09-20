import Image from "next/image";
import type { Media } from "@/payload-types";

/** A Payload upload relationship is either a populated document or a bare id,
 * depending on the query's depth. Only a populated one can be rendered. */
export type MediaRef = Media | number | null | undefined;

export function resolveMedia(value: MediaRef): Media | undefined {
  return value && typeof value === "object" && value.url ? value : undefined;
}

/**
 * Renders a Payload media record. Returns null when the relationship was not
 * populated or the record has no file — callers show their own placeholder
 * rather than this component inventing one.
 *
 * alt comes from the record and is required at the schema level, so an image
 * can never render without it.
 */
export default function MediaImage({
  media,
  className,
  sizes,
  priority,
  fill,
}: {
  media: MediaRef;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Fill the positioned parent instead of using the record's intrinsic size. */
  fill?: boolean;
}) {
  const file = resolveMedia(media);
  if (!file?.url) return null;

  if (fill) {
    return (
      <Image
        src={file.url}
        alt={file.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <Image
      src={file.url}
      alt={file.alt}
      width={file.width ?? 1600}
      height={file.height ?? 900}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
