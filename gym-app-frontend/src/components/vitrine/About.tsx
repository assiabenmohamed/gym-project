"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

function About() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  return (
    <div className="bg-black flex flex-col md:flex-row justify-center items-center gap-4 p-10">
      <div className="md:w-1/2 flex justify-center " data-aos="fade-up">
        <Image
          src="/gallary/about.png"
          width={500}
          height={500}
          alt="about"
        ></Image>
      </div>
      <div
        className="flex flex-col justify-center items-center gap-4 text-white md:w-1/2"
        data-aos="fade-up"
      >
        <h1 className="font-bold font-Oswald text-xl md:text-3xl lg:text-[50px] uppercase mb-6">
          About me
        </h1>
        <p className="text-[15px] lg:text-[18px] text-center">
          You’ll look at graphs and charts in Task One, how to approach the task
          and the language needed for a successful answer. You’ll examine Task
          Two questions and learn how to plan, write and check academic essays.
          Task One, how to approach the task and the language needed for a
          successful answer. You’ll examine Task Two questions and learn how to
          plan, write and check academic essays.
        </p>
        <motion.button
          className="relative overflow-hidden px-4 lg:px-10 py-2 rounded border border-white text-white font-semibold xl:text-[18px]  "
          whileHover="hover"
          variants={{
            hover: { color: "#ffffff" }, // 👈 texte devient blanc
            initial: { color: "#ff1313" }, // text-blue-600
          }}
        >
          {/* Barre de fond animée */}
          <motion.div
            className="absolute left-0 top-0 h-full w-full origin-left bg-[#ff1313]  "
            initial={{ y: -100 }}
            variants={{
              hover: { y: 0, color: "white" },
            }}
            transition={{ duration: 0.5, ease: "linear" }}
          />
          {/* Texte par-dessus */}
          <span className="relative z-10 uppercase font-Oswald">
            View Courses
          </span>
        </motion.button>
      </div>
    </div>
  );
}

export default About;
