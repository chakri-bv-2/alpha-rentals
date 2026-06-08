import { useState } from 'react';

const FALLBACK = '/cars/placeholder.svg';

/** Image that swaps to a local placeholder if the source fails to load. */
export default function CarImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [errored, setErrored] = useState(false);
  return (
    <img
      src={errored || !src ? FALLBACK : src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
