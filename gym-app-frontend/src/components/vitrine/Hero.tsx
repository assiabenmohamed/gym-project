"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import Gallary from "./Gallary";
const offer = [
  {
    image: "/gallary/team1.png",
    title: "Body building",
    description:
      "You’ll look at graphs and charts in Task One, how to approach the task.",
  },
  {
    image: "/gallary/team2.png",
    title: "Muscle Gain",
    description:
      "You’ll look at graphs and charts in Task One, how to approach the task",
  },
  {
    image: "/gallary/team3.png",
    title: "Weight Loss",
    description:
      "You’ll look at graphs and charts in Task One, how to approach the task",
  },
];
function Hero() {
  return (
    <div className="w-screen">
      <div
        className="
      xl:bg-[url('/h1_hero.png')] 
      bg-no-repeat 
      bg-cover 
      bg-center 
      md:bg-[center_75px] 
      bg-scroll 
      md:bg-fixed 
      sm:h-[600px]
      relative
      h-[50vh]
      md:h-[60vh]
      lg:h-[70vh]
      xl:h-screen
    "
      >
        <Image
          src="/h1_hero.png"
          alt="hero"
          fill
          priority
          className="object-cover xl:hidden"
        />

        {/* Container pour le texte avec un positionnement amélioré */}
        <div className="relative z-10 h-full flex flex-col justify-center items-start pl-8 md:pl-16 lg:pl-24">
          <motion.p
            className="text-white font-bold font-Oswald text-3xl md:text-5xl lg:text-[70px] uppercase"
            style={{
              WebkitTextStroke: "2px white",
              color: "transparent",
            }}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            Hi This is PulseFit
          </motion.p>

          <motion.p
            className="text-white font-bold font-Oswald text-5xl md:text-7xl lg:text-[140px] uppercase mt-4"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 20, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.6 }}
          >
            Gym Trainer
          </motion.p>

          <motion.div
            className="mt-8"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 40, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.6 }}
          >
            <motion.button
              className="relative overflow-hidden px-6 py-2 rounded border border-[#ff1313] text-[#ff1313] font-semibold"
              whileHover="hover"
              variants={{
                hover: { color: "#ffffff" },
                initial: { color: "#ff1313" },
              }}
            >
              <motion.div
                className="absolute left-0 top-0 h-full w-full origin-left bg-[#ff1313a9]"
                initial={{ scaleY: 0 }}
                variants={{
                  hover: { scaleY: 1, color: "white" },
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              <span className="relative z-10">MY COURSES</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
      <div className="bg-black">
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
        <h1 className=" g-clip-text text-white font-bold font-Oswald text-[120px] uppercase styleh1 text-center ">
          What I Offer
        </h1>
        <div className="bg-black py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:px-40 md:px-10">
            {offer.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl shadow-md text-center flex flex-col gap-4"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={500}
                  quality={100}
                  className=" rounded-md mb-2"
                />
                <h2 className="text-3xl text-white font-bold font-Oswald ">
                  {item.title}
                </h2>
                <p className="text-[16px] text-white">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
        <Gallary></Gallary>
      </div>
    </div>
  );
}

export default Hero;
