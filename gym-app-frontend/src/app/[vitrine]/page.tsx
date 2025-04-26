import Hero from "@/components/vitrine/Hero";
import Navbar from "@/components/vitrine/Navbar";
import Pricing from "@/components/vitrine/Pricing";
import React from "react";

function page() {
  return (
    <div className="w-screen overflow-x-hidden  ">
      <Navbar></Navbar>
      <Hero></Hero>
      <Pricing></Pricing>
    </div>
  );
}

export default page;
