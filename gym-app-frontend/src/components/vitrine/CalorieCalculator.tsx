"use client";
import React, { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Buttonsp from "./Buttonsp";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import CaloriePDF from "./Caloriepdf";
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
    WEIGHSTATUS: "Obese III",
  },
];
function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [Activity, setActivity] = useState("1.2");
  const [Calories, setCalories] = useState<number | null>(null);

  const calculateCalories = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);
    const act = parseFloat(Activity);
    if (!h || !w || !a) return;
    const bmr =
      gender === "male"
        ? 88.36 + 13.4 * w + 4.8 * h - 5.7 * a
        : 447.6 + 9.2 * w + 3.1 * h - 4.3 * a;

    const tdee = bmr * act;
    setCalories(Math.round(tdee));
  };

  return (
    <div
      className={`lg:w-screnn flex px-4 bg-black py-10 ${
        !Calories ? "flex items-center justify-center w-full" : ""
      }`}
    >
      <div className={`lg:w-1/2 flex flex-col items-center justify-center`}>
        <Card className="w-full max-w-md mx-auto bg-black border-white/50 shadow-md">
          <CardHeader>
            <h3 className="text-accent text-lg mb-2">check your body</h3>
            <CardTitle className=" text-white text-4xl font-Oswald mb-10">
              CALORIE CALCULATOR CHART
            </CardTitle>
            <CardDescription className="text-white text-center">
              Enter your personal details to calculate your daily calorie needs
              for maintaining or adjusting your weight goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-white">
            <div className="space-y-4">
              <Label htmlFor="Age">Age</Label>
              <Input
                type="number"
                value={age}
                id="Age"
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age in years"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                  />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                  />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4 ">
              <Label>Height (cm)</Label>
              <Input
                type="number"
                placeholder="Height in cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            <div className="space-y-4 ">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                placeholder="Weight in kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div className="text-white space-y-4">
              <Label>Activity Level</Label>
              <Select value={Activity} onValueChange={setActivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.2">
                    Sedentary (little or no exercise)
                  </SelectItem>
                  <SelectItem value="1.375">
                    Lightly active (1–3 days/week)
                  </SelectItem>
                  <SelectItem value="1.55">
                    Moderately active (3–5 days/week)
                  </SelectItem>
                  <SelectItem value="1.725">
                    Very active (6–7 days/week)
                  </SelectItem>
                  <SelectItem value="1.9">Super active (twice/day)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-center">
              <Buttonsp className="w-full mt-2" onClick={calculateCalories}>
                Calculate Calories
              </Buttonsp>
            </div>

            {Calories && (
              <div className="text-center mt-4">
                <p className="text-lg font-semibold">
                  Estimated Daily Calories: {Calories} kcal
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {Calories && (
        <div className="lg:w-1/2 px-6 mt-10">
          {/* Bouton de téléchargement PDF */}
          <div className="text-right mb-4">
            <PDFDownloadLink
              document={<CaloriePDF calories={Calories} />}
              fileName="calorie-recommendations.pdf"
            >
              {({ loading }) =>
                loading ? (
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                    disabled
                  >
                    Génération...
                  </button>
                ) : (
                  <button className="bg-accent hover:bg-accent/90 text-white py-2 px-4 rounded font-semibold transition">
                    Télécharger en PDF
                  </button>
                )
              }
            </PDFDownloadLink>
          </div>

          {/* Tableau affiché à l'écran */}
          <h2 className="text-white text-2xl font-semibold mb-4">
            Calorie Recommendations
          </h2>

          <div className="overflow-x-auto rounded-md border border-white/20 shadow-md">
            <table className="w-full text-center border-collapse text-white text-sm">
              <thead>
                <tr className="bg-accent text-white uppercase">
                  <th className="py-3 px-4 border border-white/20">Goal</th>
                  <th className="py-3 px-4 border border-white/20">
                    Calories/day
                  </th>
                  <th className="py-3 px-4 border border-white/20">%</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { goal: "Maintain weight", value: Calories, percent: 100 },
                  {
                    goal: "Mild weight loss (0.25 kg/week)",
                    value: Calories * 0.9,
                    percent: 90,
                  },
                  {
                    goal: "Weight loss (0.5 kg/week)",
                    value: Calories * 0.79,
                    percent: 79,
                  },
                  {
                    goal: "Extreme weight loss (1 kg/week)",
                    value: Calories * 0.59,
                    percent: 59,
                  },
                  {
                    goal: "Mild weight gain (0.25 kg/week)",
                    value: Calories * 1.1,
                    percent: 110,
                  },
                  {
                    goal: "Weight gain (0.5 kg/week)",
                    value: Calories * 1.21,
                    percent: 121,
                  },
                  {
                    goal: "Fast weight gain (1 kg/week)",
                    value: Calories * 1.41,
                    percent: 141,
                  },
                ].map((item, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-[#111]" : "bg-black"
                    } hover:bg-accent/80 hover:text-white transition`}
                  >
                    <td className="py-3 px-4 border border-white/10">
                      {item.goal}
                    </td>
                    <td className="py-3 px-4 border border-white/10">
                      {Math.round(item.value)} kcal
                    </td>
                    <td className="py-3 px-4 border border-white/10">
                      {item.percent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalorieCalculator;
