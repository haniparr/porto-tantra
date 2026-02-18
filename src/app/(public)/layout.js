// app/(public)/layout.jsx

// 1. CSS GLOBAL (Wajib di paling atas)
import "../globals.css";

// 2. IMPORT SEMUA STYLE DARI FOLDER APP/STYLES
// (Daftar ini diambil dari main.js Anda)
import "../styles/typography.css"; // Pastikan font dimuat duluan
import "../styles/hero.css";
import "../styles/grid.css";
import "../styles/case-study.css";
import "../styles/animations.css";
import "../styles/navbar.css";
import "../styles/footer.css";
import "../styles/gradient-bg.css";
import "../styles/circle-animator.css";
import "../styles/skill-ticker.css";
import "../styles/about.css";
import "../styles/featured-work.css";
import "../styles/blog.css";
import "../styles/button.css";
import "../styles/parallax-intro.css";
import "../styles/services.css";
import "../styles/blog-page.css";
import "../styles/blog-details.css";
import "../styles/contact.css";

// 3. Components & Utils
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollAnimations from "../components/utils/ScrollAnimations";
import SmoothScroll from "../components/utils/SmoothScroll";
import ErrorBoundary from "../components/ui/ErrorBoundary";

// RootLayout is now in src/app/layout.tsx
// This layout only handles the public pages structure
export default function PublicLayout({ children }) {
  return (
    <ErrorBoundary>
      <div className="sticky-blur-top"></div>
      <div className="sticky-blur-bottom"></div>
      <SmoothScroll />
      <ScrollAnimations />

      <Navbar />

      <div
        id="main-wrapper"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </div>

      <Footer />
    </ErrorBoundary>
  );
}
