"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

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

function Categorie() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  return (
    <div>
      <div className="bg-black py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:px-40 md:px-10">
          {offer.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl shadow-md text-center flex flex-col gap-4"
              data-aos="fade-up"
              data-aos-delay={index * 200}
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
    </div>
  );
}

export default Categorie;
