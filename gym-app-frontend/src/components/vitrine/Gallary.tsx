"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
const gallery = [
  {
    image: "/gallary/gallery1.png",
    title: "Muscle Gain",
    variants: {
      initial: {
        y: "-100%",
        opacity: 0,
      },
      hover: {
        y: "0%",
        opacity: 0.2,
        transition: {
          duration: 0.8,
          ease: "easeIn",
        },
      },
    },
  },
  {
    image: "/gallary/gallery2.png",
    title: "Muscle Gain",
    variants: {
      initial: {
        x: "-100%",
        opacity: 0,
      },
      hover: {
        x: "0%",
        opacity: 0.2,
        transition: {
          duration: 0.8,
          ease: "easeIn",
        },
      },
    },
  },
  {
    image: "/gallary/gallery3.png",
    title: "Muscle Gain",
    variants: {
      initial: {
        x: "-100%",
        opacity: 0,
      },
      hover: {
        x: "0%",
        opacity: 0.2,
        transition: {
          duration: 0.8,
          ease: "easeIn",
        },
      },
    },
  },
  {
    image: "/gallary/gallery4.png",
    title: "Muscle Gain",
    variants: {
      initial: {
        y: "-100%",
        opacity: 0,
      },
      hover: {
        y: "0%",
        opacity: 0.2,
        transition: {
          duration: 0.8,
          ease: "easeIn",
        },
      },
    },
  },
  {
    image: "/gallary/gallery5.png",
    title: "Muscle Gain",
    variants: {
      initial: {
        x: "-100%",
        opacity: 0,
      },
      hover: {
        x: "0%",
        opacity: 0.2,
        transition: {
          duration: 0.8,
          ease: "easeIn",
        },
      },
    },
  },
  {
    image: "/gallary/gallery6.png",
    title: "Muscle Gain",
    variants: {
      initial: {
        x: "-100%",
        opacity: 0,
      },
      hover: {
        x: "0%",
        opacity: 0.2,
        transition: {
          duration: 0.5,
          ease: "easeIn",
        },
      },
    },
  },
];
function Gallary() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-20 gap-4">
        {gallery.map((item, index) => (
          <div key={index} className="relative w-full h-80 overflow-hidden">
            {/* Base Image */}
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500"
            />

            {/* The key fix: We need to use the proper approach for Framer Motion hover effects */}
            <motion.div
              className="absolute inset-0"
              initial="initial"
              whileHover="hover"
            >
              {/* Red Overlay */}
              <motion.div
                variants={item.variants}
                className="absolute top-0 left-0 w-full h-full bg-red-600 bg-opacity-50 z-20 overflow-hidden"
              />

              {/* Text Overlay */}
              <motion.div
                variants={{
                  initial: { opacity: 0 },
                  hover: { opacity: 1 },
                }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                className="absolute inset-0 flex items-center justify-center z-20 "
              >
                <h3 className="text-white font-bold font-Oswald text-4xl">
                  {item.title}
                </h3>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallary;
