"use client";
import Image from "next/image";
import { motion } from "framer-motion";

function Hero({ title }: any) {
  return (
    <div className="w-full relative mt-16">
      {/* Image responsive avec largeur spécifique */}
      <Image
        src="/hero2.png"
        alt="hero"
        layout="responsive"
        width={2000} // Largeur de l'image
        height={1125} // Hauteur de l'image pour un ratio 16:9
        priority
        className="object-cover w-full" // "w-full" pour que l'image prenne toute la largeur
      />

      {/* Contenu par-dessus l'image */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-start pl-8 md:pl-16 lg:pl-24">
        <motion.p
          className="text-white font-bold font-Oswald text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase mt-4"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 20, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, delay: 0.6 }}
        >
          {title}
        </motion.p>
      </div>
    </div>
  );
}

export default Hero;
