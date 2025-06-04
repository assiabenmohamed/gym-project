"use client";
import Categorie from "@/components/vitrine/Categorie";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Hero from "@/components/vitrine/Heroauther";
import Planning from "@/components/vitrine/Planning";
import Pricing from "@/components/vitrine/Pricing";
function page() {
  return (
    <div>
      <Hero title="Services"></Hero>
      <div className="bg-black">
        <h1 className=" g-clip-text text-white font-bold font-Oswald text-[120px] uppercase styleh1 text-center ">
          What I Offer
        </h1>
        <Categorie></Categorie>
        <div className="  text-white  flex flex-col md:flex-row">
          <div className="w-full relative py-2 px-6 md:w-1/2 ">
            <Image
              src="/cat1.png"
              alt="hero"
              width={600}
              height={500}
              className="opacity-70"
            ></Image>
            <div className="text-center !opacity-100 absolute top-1/6 lg:top-1/3 ">
              <h1 className=" text-2xl lg:text-4xl lg:text-[50px] uppercase font-[500] font-Oswald">
                Personal traning
              </h1>
              <p className="text-[15px] lg:text-[20px] xl:px-[70px] leading-[1.6] mb-2">
                You’ll look at graphs and charts in Task One, how to approach
                the task and <br />
                the language needed for a successful answer.
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
          <div className="w-full relative py-2 px-6 md:w-1/2 ">
            <Image
              src="/cat2.png"
              alt="hero"
              width={600}
              height={500}
              className="opacity-50"
            ></Image>
            <div className="text-center !opacity-100 absolute  top-1/6 lg:top-1/3 ">
              <h1 className="text-2xl lg:text-5xl xl:text-[50px]  uppercase font-[500] font-Oswald">
                Group traning
              </h1>
              <p className="text-[15px] lg:text-[20px] xl:px-[70px] leading-[1.6] mb-2">
                You’ll look at graphs and charts in Task One, how to approach
                the task and <br /> the language needed for a successful answer.
              </p>
              <motion.button
                className="relative overflow-hidden px-4 lg:px-10  py-2 rounded border border-[#ff1313] bg-[#ff1313]  font-semibold text-[15px] lg:text-[18px]  "
                whileHover="hover"
                variants={{
                  hover: { color: "#ffffff" }, // 👈 texte devient blanc
                  initial: { color: "#ff1313" }, // text-blue-600
                }}
              >
                {/* Barre de fond animée */}
                <motion.div
                  className="absolute left-0 top-0 h-full w-full origin-left  "
                  initial={{ x: -200 }}
                  variants={{
                    hover: { x: 0, backgroundColor: "#ff1313ba" },
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
        </div>
      </div>
      <Planning></Planning>
      <Pricing></Pricing>
    </div>
  );
}

export default page;
