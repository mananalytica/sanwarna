import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-6xl text-champagne">404</p>
      <h1 className="mt-4 font-display text-2xl text-graphite">
        This piece isn&apos;t in the case.
      </h1>
      <p className="mt-3 text-graphite/55">
        The page you&apos;re looking for has moved or doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-champagne px-7 py-3 text-sm font-medium text-graphite hover:bg-champagne-light"
      >
        Back to SANWARNA
      </Link>
    </div>
  );
}
