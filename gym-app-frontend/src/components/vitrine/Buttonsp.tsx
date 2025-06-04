"use client";
import React from "react";
import { motion } from "framer-motion";

function Buttonsp({ onClick,children }: any) {
  return (
    <div>
      <motion.button
        className="relative overflow-hidden px-4 lg:px-10 py-2 rounded border border-white text-white font-semibold xl:text-[18px]  "
        whileHover="hover"
        variants={{
          hover: { color: "#ffffff" }, // 👈 texte devient blanc
          initial: { color: "#ff1313" }, // text-blue-600
        }}
        onClick={onClick}
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
        <span className="relative z-10 uppercase font-Oswald">{children}</span>
      </motion.button>
    </div>
  );
}

export default Buttonsp;
