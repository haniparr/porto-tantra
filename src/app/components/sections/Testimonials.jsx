import Image from "next/image";
// Import CSS khusus Testimonials
import "@/src/styles/testimonials.css";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Small Business Owner",
      company: "FinVision",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      quote:
        "Legally Always has been an invaluable partner in navigating the complexities of business law.",
    },
    {
      name: "David Chen",
      role: "CTO",
      company: "TechFlow",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      quote:
        "Their strategic insight transformed our product roadmap and accelerated our growth significantly.",
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      company: "Bloom & Co",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
      quote:
        "The rebranding campaign was a massive success. We saw a 40% increase in engagement within the first month.",
    },
    {
      name: "Michael Chang",
      role: "Founder",
      company: "StartUp Inc",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      quote:
        "Professional, creative, and data-driven. Exactly what we needed to take our business to the next level.",
    },
    {
      name: "Jessica Lee",
      role: "VP of Operations",
      company: "LogiTech",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      quote:
        "Efficiency and clarity are their hallmarks. They streamlined our processes beautifully.",
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="section-title">Client Stories</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, index) => (
            <div key={index} className="testimonial-card">
              <div className="card-header">
                {/* Avatar */}
                {/* Kita set width/height fix (misal 60px) karena di CSS biasanya bulat kecil */}
                <Image
                  src={t.image}
                  alt={t.name}
                  className="client-avatar"
                  width={60}
                  height={60}
                  style={{ objectFit: "cover" }}
                />

                <div className="client-info">
                  <h4 className="client-company">{t.company}</h4>
                  <p className="client-details">
                    {t.name} - {t.role}
                  </p>
                </div>
                <span className="quote-icon">“</span>
              </div>
              <p className="testimonial-quote">{t.quote}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
