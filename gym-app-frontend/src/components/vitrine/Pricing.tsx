"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';

const gymOffers = [
  {
    title: "Basic Plan",
    price: "$20/month",
    features: [
      "Access to gym equipment",
      "Free riding sessions",
      "Group fitness classes (2x/week)",
      "Month-to-month subscription",
      "Access to locker rooms and showers",
    ],
  },
  {
    title: "Premium Plan",
    price: "$50/month",
    features: [
      "Unlimited classes (yoga, weight loss, HIIT)",
      "Personal trainer sessions (2x/month)",
      "Free riding + cardio zone access",
      "Nutrition advice included",
      "Month-to-month subscription",
    ],
  },
  {
    title: "Elite Plan (6 months)",
    price: "$250 total",
    features: [
      "Unlimited equipment and classes",
      "Dedicated personal trainer",
      "Specialized weight loss programs",
      "Access to VIP fitness lounge",
      "Free fitness assessment every month",
    ],
  },
];
function Pricing() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  return (
    <div className="bg-black ">
      <h1
        className="text-white font-bold font-Oswald text-3xl md:text-5xl lg:text-[70px] uppercase styleh1 text-center p-16"
        data-aos="fade-up"
        data-aos-delay={200}
      >
        Pricing
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        {gymOffers.map((offer, index) => (
          <div
            key={index}
            className="  border-[#ffffff2d] border p-4 mt-6"
            data-aos="fade-up"
            data-aos-delay={index * 200}
          >
            <Image
              src="/price.svg"
              alt="price"
              width={80}
              height={60}
              quality={100}
              className="bg-[#ff1313] p-4 rounded-full"
            ></Image>
            <h2 className="text-white mt-3 font-[500]  text-xl md:text-3xl lg:text-[30px] uppercase">
              {offer.title}
            </h2>
            <p className="text-[#ff1313]   text-xl md:text-3xl lg:text-[30px] uppercase font-light mb-6">
              {offer.price}
            </p>
            <ul className="flex flex-col gap-3">
              {offer.features.map((feature, index) => (
                <li
                  key={index}
                  className="text-white font-bold text-lg  md:text-[16px] flex items-center gap-4"
                >
                  <FaCheck className="text-[#ff1313]" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
