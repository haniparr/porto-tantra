import Link from "next/link";

/**
 * Primary Button - Tombol aksi standar (untuk onClick atau Form Submit)
 * Usage: <PrimaryButton type="submit" onClick={...}>Click Me</PrimaryButton>
 */
export function PrimaryButton({ children, className = "", ...props }) {
  // Menggabungkan class bawaan 'btn-primary' dengan class tambahan jika ada
  return (
    <button className={`btn-primary ${className}`} {...props}>
      {children}
    </button>
  );
}

/**
 * Primary Link Button - Tombol yang berfungsi sebagai Link navigasi
 * Usage: <PrimaryLinkButton href="/about">About Me</PrimaryLinkButton>
 */
export function PrimaryLinkButton({
  href,
  children,
  className = "",
  ...props
}) {
  // Pengecekan sederhana: Jika link eksternal (http/https), gunakan <a> biasa
  // Jika link internal, gunakan <Link> Next.js untuk performa
  const isExternal = href.startsWith("http");

  if (isExternal) {
    return (
      <a
        href={href}
        className={`btn-primary ${className}`}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`btn-primary ${className}`} {...props}>
      {children}
    </Link>
  );
}
