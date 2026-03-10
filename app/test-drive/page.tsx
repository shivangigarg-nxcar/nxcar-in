'use client';

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Card } from "@components/ui/card";
import { Gauge, ArrowLeft, Car } from "lucide-react";
import Link from "next/link";
import { CarSelector, type CarModel } from "@components/test-drive/car-selector";
import { AccelerationTest } from "@components/test-drive/acceleration-test";

const POPULAR_CARS: CarModel[] = [
  {
    id: "thar",
    name: "Thar",
    brand: "Mahindra",
    image: "/images/cars/thar.jpg",
    specs: {
      power: "150 BHP",
      torque: "320 Nm",
      acceleration: "0-100 in 11.5s",
      topSpeed: 155,
      fuelType: "Diesel",
      transmission: "6-Speed MT"
    },
    description: "The iconic off-roader that conquers every terrain with rugged style and unstoppable spirit.",
    color: "from-orange-500 to-red-600"
  },
  {
    id: "fortuner",
    name: "Fortuner",
    brand: "Toyota",
    image: "/images/cars/fortuner.jpg",
    specs: {
      power: "204 BHP",
      torque: "500 Nm",
      acceleration: "0-100 in 10.0s",
      topSpeed: 180,
      fuelType: "Diesel",
      transmission: "6-Speed AT"
    },
    description: "The ultimate SUV combining luxury, power, and commanding road presence.",
    color: "from-slate-600 to-slate-800"
  },
  {
    id: "scorpio-n",
    name: "Scorpio N",
    brand: "Mahindra",
    image: "/images/cars/scorpio.jpg",
    specs: {
      power: "175 BHP",
      torque: "400 Nm",
      acceleration: "0-100 in 11.0s",
      topSpeed: 170,
      fuelType: "Diesel",
      transmission: "6-Speed AT"
    },
    description: "Big, bold, and beautiful - the new Scorpio N redefines what an SUV should be.",
    color: "from-amber-600 to-orange-700"
  },
  {
    id: "creta",
    name: "Creta",
    brand: "Hyundai",
    image: "/images/cars/creta.jpg",
    specs: {
      power: "158 BHP",
      torque: "253 Nm",
      acceleration: "0-100 in 10.5s",
      topSpeed: 175,
      fuelType: "Petrol",
      transmission: "7-Speed DCT"
    },
    description: "India's favorite SUV with stunning looks, premium features, and peppy performance.",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: "xuv700",
    name: "XUV700",
    brand: "Mahindra",
    image: "/images/cars/xuv700.jpg",
    specs: {
      power: "200 BHP",
      torque: "380 Nm",
      acceleration: "0-100 in 8.5s",
      topSpeed: 200,
      fuelType: "Petrol",
      transmission: "6-Speed AT"
    },
    description: "Sophisticated technology meets thrilling performance in this flagship SUV.",
    color: "from-red-600 to-rose-700"
  },
  {
    id: "seltos",
    name: "Seltos",
    brand: "Kia",
    image: "/images/cars/seltos.jpg",
    specs: {
      power: "158 BHP",
      torque: "253 Nm",
      acceleration: "0-100 in 10.2s",
      topSpeed: 175,
      fuelType: "Petrol",
      transmission: "7-Speed DCT"
    },
    description: "Style, technology, and performance come together in this premium compact SUV.",
    color: "from-emerald-500 to-teal-600"
  }
];

export default function TestDriveSimulator() {
  const [selectedCar, setSelectedCar] = useState<CarModel | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startSimulation = () => {
    if (!selectedCar) return;
    setIsSimulating(true);
    setSpeed(0);
    setElapsedTime(0);
    
    if (!isMuted) {
      startEngineSound();
    }
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    stopEngineSound();
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSpeed(0);
    setElapsedTime(0);
    stopEngineSound();
  };

  const startEngineSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(80, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start();
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
    } catch (e) {
    }
  };

  const stopEngineSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  };

  const updateEngineSound = (currentSpeed: number) => {
    if (oscillatorRef.current && gainNodeRef.current && audioContextRef.current) {
      const baseFreq = 60 + (currentSpeed / 200) * 200;
      oscillatorRef.current.frequency.setValueAtTime(baseFreq, audioContextRef.current.currentTime);
      gainNodeRef.current.gain.setValueAtTime(0.03 + (currentSpeed / 200) * 0.05, audioContextRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (isSimulating && selectedCar) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
        setSpeed((prev) => {
          const maxSpeed = selectedCar.specs.topSpeed;
          const acceleration = maxSpeed / 15;
          const newSpeed = Math.min(prev + acceleration * 0.1, maxSpeed);
          
          if (!isMuted) {
            updateEngineSound(newSpeed);
          }
          
          if (newSpeed >= maxSpeed) {
            setIsSimulating(false);
            stopEngineSound();
          }
          
          return newSpeed;
        });
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSimulating, selectedCar, isMuted]);

  useEffect(() => {
    return () => {
      stopEngineSound();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pt-24 pb-16">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <Gauge className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 dark:text-white">
              Test Drive Simulator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Experience the thrill of driving India's most popular cars. Select a model and feel the acceleration, power, and performance.
          </p>
        </div>

        <Card className="p-6 mb-8 bg-white dark:bg-card border-slate-200 dark:border-border">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Select Your Ride</h2>
          <CarSelector cars={POPULAR_CARS} selectedCar={selectedCar} onSelect={setSelectedCar} />
        </Card>

        <AnimatePresence mode="wait">
          {selectedCar && (
            <AccelerationTest
              selectedCar={selectedCar}
              speed={speed}
              elapsedTime={elapsedTime}
              isSimulating={isSimulating}
              isMuted={isMuted}
              onStart={startSimulation}
              onStop={stopSimulation}
              onReset={resetSimulation}
              onToggleMute={() => setIsMuted(!isMuted)}
            />
          )}
        </AnimatePresence>

        {!selectedCar && (
          <Card className="p-12 bg-white dark:bg-card border-slate-200 dark:border-border text-center">
            <Car className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select a Car to Begin</h3>
            <p className="text-slate-500 dark:text-slate-400">Choose one of the popular models above to start your virtual test drive experience.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
