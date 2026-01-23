import ParallaxIntro from "@/app/components/sections/ParallaxIntro";
import Hero from "@/app/components/sections/Hero";
import SkillTicker from "@/app/components/sections/SkillTicker";
import FeaturedWork from "@/app/components/sections/FeaturedWork";
import About from "@/app/components/sections/About";
import BlogSection from "@/app/components/sections/BlogSection";
import GradientWrapper from "@/app/components/ui/GradientWrapper"; // Wrapper mouse effect

export const metadata = {
  title: "Tantra Hariastama - Graphic Designer",
  description:
    "Portfolio of Tantra Hariastama, a Graphic Designer specializing in visual identity and digital design.",
};

export default function Home() {
  return (
    <div className="homepage-content">
      {/* Sesuai main.js: <div class="gradient-container">...</div> 
        GradientWrapper akan menangani efek mouse movement background.
      */}
      <GradientWrapper className="min-h-screen">
        {/* 1. Intro Section */}
        <ParallaxIntro />

        {/* 2. Hero Section */}
        <Hero />

        {/* 3. About Me */}
        <About />

        {/* 4. Skills Marquee */}
        <SkillTicker />

        {/* 5. Selected Projects */}
        <FeaturedWork />

        {/* 6. Latest Thoughts (Blog) - Server Component fetching data */}
        <BlogSection />
      </GradientWrapper>
    </div>
  );
}
