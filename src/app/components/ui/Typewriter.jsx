"use client";

import { useState, useEffect } from "react";

export default function Typewriter({
  words = [],
  wait = 2000,
  typeSpeed = 100,
  deleteSpeed = 50,
}) {
  const [txt, setTxt] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(typeSpeed);

  useEffect(() => {
    const handleType = () => {
      const current = wordIndex % words.length;
      const fullTxt = words[current];

      // Logic ketik / hapus
      setTxt((prev) =>
        isDeleting
          ? fullTxt.substring(0, prev.length - 1)
          : fullTxt.substring(0, prev.length + 1),
      );

      // Kecepatan standar
      let nextSpeed = typeSpeed;

      if (isDeleting) {
        nextSpeed = deleteSpeed;
      }

      // Logic transisi state
      if (!isDeleting && txt === fullTxt) {
        // Selesai mengetik, tunggu sebentar sebelum menghapus
        nextSpeed = wait;
        setIsDeleting(true);
      } else if (isDeleting && txt === "") {
        // Selesai menghapus, pindah ke kata berikutnya
        setIsDeleting(false);
        setWordIndex((prev) => prev + 1);
        nextSpeed = 500; // Pause sebentar sebelum mulai ngetik lagi
      }

      setSpeed(nextSpeed);
    };

    const timer = setTimeout(handleType, speed);

    return () => clearTimeout(timer);
  }, [txt, isDeleting, wordIndex, words, wait, typeSpeed, deleteSpeed, speed]);

  return (
    <span className="txt-type">
      <span className="wrap border-r-2 border-current pr-1">{txt}</span>
    </span>
  );
}
