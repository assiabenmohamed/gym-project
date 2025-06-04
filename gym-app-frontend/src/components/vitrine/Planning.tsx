"use client";
import React, { useState } from "react";

const days = [
  "Time",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Define types for our data structure
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

interface TimeSlot {
  time: string;
  Monday: string;
  Tuesday: string;
  Wednesday: string;
  Thursday: string;
  Friday: string;
  Saturday: string;
  Sunday: string;
}

const timetable: TimeSlot[] = [
  {
    time: "6:00am - 8:00am",
    Monday: "WEIGHT LOOSE - RLefew D. Loee",
    Tuesday: "Cardio - RLefew D. Loee",
    Wednesday: "Yoga - Keaf Shen",
    Thursday: "Fitness - Kimberly Stone",
    Friday: "",
    Saturday: "Boxing - Rachel Adam",
    Sunday: "Body Building - Robert Cage",
  },
  {
    time: "10:00am - 12:00am",
    Monday: "",
    Tuesday: "Fitness - Kimberly Stone",
    Wednesday: "WEIGHT LOOSE - RLefew D. Loee",
    Thursday: "Cardio - RLefew D. Loee",
    Friday: "Body Building - Robert Cage",
    Saturday: "Karate - Donald Grey",
    Sunday: "",
  },
  {
    time: "5:00pm - 7:00pm",
    Monday: "Boxing - Rachel Adam",
    Tuesday: "Karate - Donald Grey",
    Wednesday: "Body Building - Robert Cage",
    Thursday: "",
    Friday: "Yoga - Keaf Shen",
    Saturday: "Cardio - RLefew D. Loee",
    Sunday: "Fitness - Kimberly Stone",
  },
  {
    time: "7:00pm - 9:00pm",
    Monday: "Cardio - RLefew D. Loee",
    Tuesday: "",
    Wednesday: "Yoga - Keaf Shen",
    Thursday: "Karate - Donald Grey",
    Friday: "Boxing - Rachel Adam",
    Saturday: "WEIGHT LOOSE - RLefew D. Loee",
    Sunday: "Boxing - Rachel Adam",
  },
];

function Planning() {
  const [change, setChange] = useState(false);

  return (
    <div className="px-10 bg-[#111111]">
      <section className="text-white py-12">
        <h2 className="text-3xl font-bold text-center text-accent mb-8">
          Weekly Classes Timetable
        </h2>

        {/* Responsive table container */}
        <div className="overflow-x-auto">
          <table className="min-w-[800px] w-full text-center border border-gray-700">
            <thead>
              <tr className="bg-accent text-white">
                {days.map((day) => (
                  <th key={day} className="py-3 px-4 border border-gray-700">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timetable.map((slot, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="py-3 px-2 border text-accent bg-black border-gray-700 text-sm whitespace-nowrap">
                    {slot.time}
                  </td>
                  {days.slice(1).map((day, j) => {
                    // Fix: Use type assertion to tell TypeScript that day is a key of TimeSlot
                    const dayKey = day as keyof typeof slot;
                    return (
                      <td
                        key={j}
                        className={`${(i + j) % 2 === 0 ? "bg-black " : "bg-[#111111]"} py-3 text-white/50 hover:text-white/100 px-4 border border-gray-700`}
                      >
                        {slot[dayKey] || "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Planning;
