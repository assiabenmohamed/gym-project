"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "@radix-ui/react-label";
import Buttonsp from "./Buttonsp";
const bmitable = [
  {
    BMI: "Below 18.5",
    WEIGHTSTATUS: "Underweight",
  },
  {
    BMI: "18.5 - 24.9",
    WEIGHTSTATUS: "Normal",
  },
  {
    BMI: "25.0 - 29.9",
    WEIGHTSTATUS: "Overweight",
  },
  {
    BMI: "30.0 - 34.9",
    WEIGHTSTATUS: "Obese I",
  },
  {
    BMI: "35.0 - 39.9",
    WEIGHTSTATUS: "Obese II",
  },
  {
    BMI: "40 -and Above",
    WEIGHTSTATUS: "Obese III",
  },
];
function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const calculateBMI = () => {
    if (height && weight) {
      const heightInMeters = parseFloat(height) / 100;
      const weightInKg = parseFloat(weight);
      const calculatedBMI = weightInKg / (heightInMeters * heightInMeters);

      setBmi(calculatedBMI.toFixed(2));

      // Set category based on BMI
      if (calculatedBMI < 18.5) {
        setCategory("Underweight");
      } else if (calculatedBMI >= 18.5 && calculatedBMI < 25) {
        setCategory("Normal");
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        setCategory("Overweight");
      } else if (calculatedBMI >= 30 && calculatedBMI < 35) {
        setCategory("Obese I");
      } else if (calculatedBMI >= 35 && calculatedBMI < 40) {
        setCategory("Obese II");
      } else {
        setCategory("Obese III");
      }
    }
  };
  // Color mapping for BMI categories
  const getCategoryColor = () => {
    switch (category) {
      case "Underweight":
        return "bg-blue-100";
      case "Normal":
        return "bg-green-100";
      case "Pre-obesity":
        return "bg-yellow-100";
      case "Obese I":
        return "bg-orange-100";
      case "Obese II":
        return "bg-red-100";
      case "Obese III":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-100";
    }
  };
  return (
    <div className="bg-black flex flex-col lg:flex-row w-screen py-10 ">
      <div className="lg:w-1/2  px-6">
        <h3 className="text-accent text-lg mb-2">check your body</h3>
        <h1 className=" text-white text-4xl font-Oswald mb-10">
          BMI CALCULATOR CHART
        </h1>
        <table className=" w-full text-center border border-gray-700">
          <thead>
            <tr className="bg-accent text-white">
              <th className="py-3 px-4 border border-gray-700">BMI </th>
              <th className="py-3 px-4 border border-gray-700">
                WEIGHT STATUS
              </th>
            </tr>
          </thead>
          <tbody>
            {bmitable.map((slot, i) => (
              <tr key={i} className="border-t border-gray-700">
                <td
                  className={`${i % 2 == 0 ? "bg-black " : "bg-[#111111]"} py-3 px-2 border text-white/50  border-white/50 text-sm whitespace-nowrap`}
                >
                  {slot.BMI}
                </td>
                <td
                  className={`${i % 2 == 0 ? "bg-black " : "bg-[#111111]"} py-3 text-white/50 hover:text-white/100 px-4 border border-white/50`}
                >
                  {slot.WEIGHTSTATUS}
                  {/* {setchange(!change)} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:w-1/2 flex flex-col items-center justify-center">
        {/* <h3 className="text-accent text-lg mb-2">check your body</h3>
        <h1 className=" text-white text-4xl font-Oswald mb-10">
          BMI CALCULATOR CHART
        </h1>
        <p className="text-white text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
          voluptas libero quam, ad saepe distinctio fugiat aliquam, quasi at
          vitae tempore. Ex quaerat ducimus repellendus, aspernatur earum quasi
          delectus eveniet!
        </p>
        <div>
          <Input type="number" placeholder="Height/cm"></Input>
          <Input type="numbrt" placeholder="Weight/kg"></Input>
          <Button>Calcule</Button>
        </div> */}
        <Card className="w-full max-w-md mx-auto bg-black border-white/50 shadow-md">
          <CardHeader>
            <h3 className="text-accent text-lg mb-2">check your body</h3>
            <CardTitle className=" text-white text-4xl font-Oswald mb-10">
              BMI CALCULATOR CHART
            </CardTitle>
            <CardDescription className="text-white text-center">
              Enter your height and weight to calculate your Body Mass Index
              (BMI) and determine your health category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-white">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter your height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="text-white"
                min="0"
                max="300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter your weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="0"
                max="500"
              />
            </div>
            {/* <Button className="w-full" onClick={calculateBMI}>
              Calculate BMI
            </Button> */}
            <div className="flex justify-center">
              <Buttonsp onClick={calculateBMI} className="text-sm">
                Calculate BMI
              </Buttonsp>
            </div>
            {bmi && (
              <div className="mt-6 text-center">
                <h3 className="text-lg font-bold">Your BMI is: {bmi}</h3>

                <div className="mt-4 relative h-8 rounded-md overflow-hidden">
                  <div className="absolute inset-0 flex">
                    <div className="w-1/6 bg-blue-400"></div>
                    <div className="w-1/6 bg-green-400"></div>
                    <div className="w-1/6 bg-yellow-400"></div>
                    <div className="w-1/6 bg-orange-400"></div>
                    <div className="w-1/6 bg-red-400"></div>
                    <div className="w-1/6 bg-red-600"></div>
                  </div>

                  {/* Position triangle marker based on BMI */}
                  <div
                    className="absolute top-0 transform -translate-x-1/2"
                    style={{
                      left: `${Math.min(Math.max((parseFloat(bmi) - 15) * 3, 0), 100)}%`,
                    }}
                  >
                    <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-yellow-500"></div>
                  </div>
                </div>

                <div className="flex text-xs mt-1">
                  <div className="w-1/6 text-center">Underweight</div>
                  <div className="w-1/6 text-center">Normal</div>
                  <div className="w-1/6 text-center">Pre-obesity</div>
                  <div className="w-1/6 text-center">Obese I</div>
                  <div className="w-1/6 text-center">Obese II</div>
                  <div className="w-1/6 text-center">Obese III</div>
                </div>

                <div className={`mt-4 p-3 rounded-md ${getCategoryColor()}`}>
                  <p className="font-medium text-black">Category: {category}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-gray-500 text-center">
            BMI is a screening tool and not a diagnostic of body fatness or
            health.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default BMICalculator;
