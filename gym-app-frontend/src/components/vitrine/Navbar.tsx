"use client";
import Image from "next/image"; // Importation de l'image
import Link from "next/link"; // Importation du composant Link de Next.js
import { usePathname } from "next/navigation"; // Permet de récupérer le chemin de la page actuelle
import React from "react"; // Importation de React
import { IoIosClose, IoMdMenu } from "react-icons/io"; // Icônes pour le menu mobile
import { motion } from "framer-motion";

// Tableau des liens de navigation
const link = [
  { name: "HOME", path: "/vitrine" },
  { name: "ABOUT", path: "/Services" },
  { name: "COURSES", path: "/Skills" },
  { name: "GALLERY", path: "/Resume" },
  { name: "BMICALCULATER", path: "/Contact" },
  { name: "SERVICES", path: "/Education" },
  { name: "OURTEAM", path: "/Contact" },
];

function Navbar() {
  const pathname = usePathname(); // Récupère le chemin de la page actuelle
  const [isOpen, setIsOpen] = React.useState(false); // Etat pour gérer l'ouverture/fermeture du menu mobile

  return (
    <div className="fixed top-0 left-0 w-full h-[80px]  px-4 z-50 flex flex-col  p-prim bg-black font-jetbrains-mono xl:px-30 xl:flex-row items-center font-bold whitespace-nowrap ">
      {/* Section Logo et Menu mobile */}
      <div className="flex justify-between w-full items-center ">
        {/* Lien vers la page d'accueil avec logo */}
        <Link href={"/"}>
          <Image src="/logoblack.png" alt="Logo" width={80} height={20} />
        </Link>

        {/* Icônes du menu mobile : afficher ou fermer */}
        <div className="xl:hidden">
          {!isOpen ? (
            <IoMdMenu
              className="text-white text-3xl cursor-pointer"
              onClick={() => setIsOpen(true)} // Ouvre le menu mobile
            />
          ) : (
            <IoIosClose
              className="text-white text-3xl cursor-pointer"
              onClick={() => setIsOpen(false)} // Ferme le menu mobile
            />
          )}
        </div>
      </div>

      {/* Menu de navigation (pour écran large) */}
      <ul className="hidden gap-6 text-white xl:flex items-center">
        {link.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`${
                pathname === item.path && "border-b border-accent text-accent"
              } capitalize font-medium hover:text-accent transition-all`}
            >
              {item.name}
            </Link>
          </li>
        ))}
        <li>
          <motion.button
            className="relative overflow-hidden px-6 py-2 rounded border border-[#ff1313] text-[#ff1313] font-semibold"
            whileHover="hover"
            variants={{
              hover: { color: "#ffffff" }, // 👈 texte devient blanc
              initial: { color: "#ff1313" }, // text-blue-600
            }}
          >
            {/* Barre de fond animée */}
            <motion.div
              className="absolute left-0 top-0 h-full w-full origin-left bg-[#ff1313a9]  "
              initial={{ scaleX: 0 }}
              variants={{
                hover: { scaleX: 1, color: "white" },
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            {/* Texte par-dessus */}
            <span className="relative z-10">log in</span>
          </motion.button>
        </li>
      </ul>

      {/* Menu mobile (affiché lorsque isOpen est vrai) */}
      <ul
        className={`${isOpen ? "flex flex-col" : "hidden"} gap-4 text-white items-center xl:hidden bg-black w-screen`}
      >
        {link.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`${
                pathname === item.path && "border-b border-accent text-accent"
              } capitalize font-medium hover:text-accent transition-all`}
              onClick={() => setIsOpen(false)} // Ferme le menu après clic
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Navbar;
