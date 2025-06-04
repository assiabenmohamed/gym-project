"use client";
import React, { useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";

const contactArray = [
  {
    type: "Location",
    value: "123 Rue de la Forme, 75000 Paris, France",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.999909024691!2d2.2922926156748213!3d48.8583730792874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc7f0b1e6b1%3A0x8c0a0b40b12e0f92!2sTour%20Eiffel!5e0!3m2!1sfr!2sfr!4v1614897243656!5m2!1sfr!2sfr",
  },
  {
    type: "Phone",
    value: ["(90) 277 278 2566", "(78) 267 256 2578"],
  },
  {
    type: "Email",
    value: ["jacson767@gmail.com", "contact56@pulsefit.com"],
  },
];

const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/assiabenmohamed",
    icon: <FaFacebook />,
  },
  {
    name: "Twitter",
    url: "https://twitter.com/assiabenmohamed",
    icon: <FaTwitter />,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/assiabenmohamed",
    icon: <FaInstagram />,
  },
];

function Footer() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const getIcon = (section: any) => {
    switch (section.type) {
      case "Location":
        return <FaMapMarkerAlt className="text-xl text-accent" />;
      case "Phone":
        return <FaPhoneAlt className="text-xl text-accent" />;
      case "Email":
        return <FaEnvelope className="text-xl text-accent" />;
      default:
        return null;
    }
  };

  return (
    <footer>
      <div className="text-white w-full py-12 flex flex-col bg-[#111111]">
        <div
          className="mx-auto flex flex-col md:flex-row gap-6 justify-evenly items-center py-[70px] w-full max-w-screen-xl"
          data-aos="fade-up"
        >
          {contactArray.map((section, index) => (
            <div key={index}>
              {section.type === "Location" ? (
                <Popover>
                  <h3 className="text-xl font-semibold text-accent mb-2 flex items-center gap-2">
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-1 text-accent">
                        {getIcon(section)}
                        {section.type}
                      </button>
                    </PopoverTrigger>
                  </h3>
                  <p className="text-white ml-2">{section.value}</p>
                  <PopoverContent className="w-[350px] h-[250px] p-0 bg-white border-gray-300 rounded-md shadow-lg mt-2">
                    <iframe
                      src={section.mapEmbedUrl}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      allowFullScreen
                      className="rounded-md"
                      title="Emplacement de la salle"
                    ></iframe>
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-accent mb-2 flex items-center gap-2">
                    {getIcon(section)}
                    {section.type}
                  </h3>
                  {Array.isArray(section.value) ? (
                    <ul className="space-y-1 ml-4 list-disc text-white">
                      {section.value.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-white ml-2">{section.value}</p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* Liens sociaux */}
        <div
          className="flex gap-4 mt-4 xl:mt-0 justify-center"
          data-aos="fade-down"
          data-aos-anchor-placement="top-bottom"
        >
          {socialLinks.map((link, index) => (
            <Link
              key={index}
              href={link.url}
              target="_blank"
              aria-label={`Lien vers ${link.name}`}
              className="w-9 h-9 border border-accent rounded-full flex items-center justify-center text-accent text-lg hover:bg-accent hover:text-white transition-all duration-500"
            >
              {link.icon}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center bg-black py-6 text-white/50">
        <p>
          ©2025 Tous droits réservés | Ce modèle est réalisé avec ❤️ par
          Colorlib
        </p>
      </div>
    </footer>
  );
}

export default Footer;
