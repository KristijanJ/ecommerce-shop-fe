import Link from "next/link";

export default function NotFound() {
  return (
    <section className="h-screen flex justify-center items-center">
      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-4">Product Not Found</h2>
        <p className="mb-8">Could not find the requested product.</p>
        <Link
          href="/"
          className="bg-primary py-4 px-8 text-white hover:bg-primary/90 transition"
        >
          Return Home
        </Link>
      </div>
    </section>
  );
}
