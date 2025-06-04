"use client";
import About from "@/components/vitrine/About";
import Categorie from "@/components/vitrine/Categorie";
import Footer from "@/components/vitrine/Footer";
import Hero from "@/components/vitrine/Heroauther";
import React from "react";

function Page() {
  return (
    <div className=" min-h-screen text-white">
      <Hero title="About me"></Hero>
      <Categorie></Categorie>
      <About></About>
    </div>
  );
}

export default Page;
