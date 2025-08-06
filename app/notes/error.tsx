"use client"

export default function Error({
  error
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <p>Could not fetch the list of notes. {error.message}</p>
    </div>
  );
}