// Import CSS khusus Contact
import "@/app/styles/contact.css";

export const metadata = {
  title: "Contact - Witantra Hariastama",
  description: "Get in touch for collaborations and projects.",
};

export default function ContactPage() {
  return (
    <section className="contact-page">
      <div className="contact-container">
        <div className="contact-hero">
          <h1 className="contact-headline">
            Got a cool project you&apos;re working on or an idea you want to
            chat about? Hit me up—I&apos;m ready to help if I can.
          </h1>
        </div>

        <div className="contact-links-section">
          <div className="contact-link-row">
            <span className="link-label">Email</span>
            <a href="mailto:witantrahariastama@gmail.com" className="link-url">
              witantrahariastama@gmail.com
            </a>
          </div>
          <div className="contact-link-row">
            <span className="link-label">Linkedin</span>
            <a
              href="https://www.linkedin.com/in/witantra-hariastama-544843118/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-url"
            >
              linkedin.com/in/witantra-hariastama-544843118
            </a>
          </div>
          <div className="contact-link-row">
            <span className="link-label">Resume</span>
            <a
              href="https://www.linkedin.com/in/witantra-hariastama-544843118/s"
              target="_blank"
              rel="noopener noreferrer"
              className="link-url"
            >
              linkedin.com/in/witantra-hariastama-544843118/s
            </a>
          </div>
        </div>

        <div className="contact-footer-cta">
          <p className="cta-text">Interested in working together?</p>
          <a href="mailto:witantrahariastama@gmail.com" className="cta-email">
            witantrahariastama@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
