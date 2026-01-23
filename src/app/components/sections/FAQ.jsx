"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "My expertise covers the three pillars of modern digital branding: Graphic Design, User Interface (UI), and Motion. From crafting your core identity to designing your website and animating your launch assets, I execute the full visual scope personally.",
  },
  {
    question: "What is your design process?",
    answer:
      "My process is lean and direct. We start by defining your core challenge, then I move immediately into strategy and execution. Because you work only with me, there are no hand-offs or communication gaps—just a straight line from problem to solution.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Because I work without agency bureaucracy, I move significantly faster. While it depends on the scope, most brand identity projects are completed in 3-5 weeks, not months. I focus on rapid iteration and maintaining momentum to get you to market sooner.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Absolutely. My client base is primarily global, spanning from North America to Southeast Asia. I have refined a remote-first workflow that turns time zone differences into an advantage—often delivering work while you sleep so it’s ready for you in the morning.",
  },
  {
    question: "How do you price your services?",
    answer:
      "I don't charge by the hour; I price by the value delivered. You will receive a clear, flat-project fee before we begin. This ensures that I am incentivized to deliver the best result efficiently, not to drag out the clock.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="section-layout">
        <div className="section-label">
          <span>[ FAQ ]</span>
        </div>
        <div className="faq-container">
          <div className="faq-header">
            <h2 className="faq-title">
              You may have some <em>questions</em>
            </h2>
          </div>

          <div className="faq-content">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`faq-item ${isOpen ? "is-open" : ""}`}
                >
                  <button
                    className="faq-question"
                    aria-expanded={isOpen}
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
