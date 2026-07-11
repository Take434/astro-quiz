import { Link } from "@tanstack/react-router";
import { LaptopMinimal, Smartphone } from "lucide-react";

export function Home() {
  return (
    <div className="p-8 flex h-screen">
      <div className="m-auto">
        <h1 className="text-4xl font-bold text-primary-content bg-primary p-1">
          Wilkommen zum Astro Quiz
        </h1>
        <p className="text-lg">
          Ein Quiz für den Astronomie Kurs an der HSRW Kamp-Lintfort,
        </p>
        <p className="text-lg">
          erstellt SoSe 26 von Jonas Giesen und Tim Herr.
        </p>
        <p className="text-lg mt-10">Bist du heute Host oder Spieler?</p>
        <div className="flex gap-5 mt-5 w-full flex-col sm:flex-row">
          <Link to="/host" className="w-full">
            <div className="border-2 border-neutral-content rounded-2xl h-[25vh] w-full flex flex-col hover:cursor-pointer hover:bg-base-300">
              <LaptopMinimal
                className="m-auto h-[80%] w-[80%]"
                strokeWidth={1}
              />
              <p className="mx-auto text-2xl">Host</p>
            </div>
          </Link>
          <Link to="/client" className="w-full">
            <div className="border-2 border-neutral-content rounded-2xl h-[25vh] w-full flex flex-col hover:cursor-pointer hover:bg-base-300">
              <Smartphone className="m-auto h-[80%] w-[80%]" strokeWidth={1} />
              <p className="mx-auto text-2xl">Spieler</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
