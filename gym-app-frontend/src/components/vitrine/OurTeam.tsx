import Image from "next/image";
import React from "react";
const teams = [
  {
    image: "/team/team-1.jpg",
    title: "Muscle Gain",
  },
  {
    image: "/team/team-2.jpg",
    title: "Muscle Gain",
  },
  {
    image: "/team/team-3.jpg",
    title: "Muscle Gain",
  },
  {
    image: "/team/team-4.jpg",
    title: "Muscle Gain",
  },
  {
    image: "/team/team-5.jpg",
    title: "Muscle Gain",
  },
  {
    image: "/team/team-6.jpg",
    title: "Muscle Gain",
  },
];

function OurTeam() {
  return (
    <div className="bg-black py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-20 gap-4 ">
        {teams.map((team, index) => (
          <div
            key={index}
            className="text-white bg-no-repeat bg-center bg-cover h-[70vh] relative group"
            style={{ backgroundImage: `url(${team.image})` }}
          >
            {/* Overlay animé au survol */}

            <div
              className="absolute left-0 bottom-0 bg-black w-full h-[40%] 
            translate-y-full opacity-0 
            group-hover:translate-y-0 group-hover:opacity-100 
            transition-all duration-500 p-4 overflow-hidden "
              style={{
                clipPath: "polygon(0 15%, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <h2 className="text-xl font-semibold  p-4 pt-8">{team.title}</h2>
            </div>
          </div>
        ))}
        {/* Base Image */}
        {/* <Image
              src={team.image}
              alt={team.title}
              fill
              className="object-cover transition-transform duration-500"
            /> */}
      </div>
    </div>
  );
}

export default OurTeam;
