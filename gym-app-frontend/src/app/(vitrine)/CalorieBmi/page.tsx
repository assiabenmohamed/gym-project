import BMICalculator from "@/components/vitrine/BMICalculator";
import CalorieCalculator from "@/components/vitrine/CalorieCalculator";
import Hero from "@/components/vitrine/Heroauther";
import React from "react";

function page() {
  return (
    <div>
      <Hero title="Health Calculators"></Hero>
      <BMICalculator></BMICalculator>
      <CalorieCalculator></CalorieCalculator>
    </div>
  );
}

export default page;
