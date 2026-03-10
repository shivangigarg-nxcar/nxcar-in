'use client';

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { 
  Gauge, 
  Fuel, 
  Zap, 
  Timer, 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Volume2,
  VolumeX,
  Car,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface CarModel {
  id: string;
  name: string;
  brand: string;
  image: string;
  specs: {
    power: string;
    torque: string;
    acceleration: string;
    topSpeed: number;
    fuelType: string;
    transmission: string;
  };
  description: string;
  color: string;
}

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

function Speedometer({ speed, maxSpeed }: { speed: number; maxSpeed: number }) {
  const percentage = (speed / maxSpeed) * 100;
  const rotation = (percentage / 100) * 240 - 120;

  return (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200 dark:text-slate-700"
          strokeDasharray="565.48"
          strokeDashoffset="188.49"
          strokeLinecap="round"
          transform="rotate(150 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="url(#speedGradient)"
          strokeWidth="8"
          strokeDasharray="565.48"
          strokeDashoffset={565.48 - (percentage / 100) * 376.99}
          strokeLinecap="round"
          transform="rotate(150 100 100)"
          className="transition-all duration-100"
        />
        <defs>
          <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0EA9B2" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="30"
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${rotation} 100 100)`}
          className="transition-transform duration-100 drop-shadow-lg"
        />
        <circle cx="100" cy="100" r="12" fill="#1e293b" className="dark:fill-slate-200" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
        <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tabular-nums">
          {Math.round(speed)}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">km/h</span>
      </div>
    </div>
  );
}

function CarSelector({ cars, selectedCar, onSelect }: { 
  cars: CarModel[]; 
  selectedCar: CarModel | null; 
  onSelect: (car: CarModel) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cars.map((car) => (
        <motion.button
          key={car.id}
          onClick={() => onSelect(car)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative p-4 rounded-xl border-2 transition-all ${
            selectedCar?.id === car.id
              ? "border-primary bg-primary/10 dark:bg-primary/20"
              : "border-slate-200 dark:border-slate-700 hover:border-primary/50 bg-white dark:bg-slate-800"
          }`}
        >
          <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${car.color} flex items-center justify-center mb-2`}>
            <Car className="h-6 w-6 text-white" />
          </div>
          <div className="text-center">
            <div className="font-bold text-slate-900 dark:text-white text-sm">{car.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{car.brand}</div>
          </div>
          {selectedCar?.id === car.id && (
            <motion.div
              layoutId="selectedIndicator"
              className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
            >
              <Sparkles className="h-3 w-3 text-white" />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}

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
            <motion.div
              key={selectedCar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-2 gap-6"
            >
              <Card className="p-6 bg-white dark:bg-card border-slate-200 dark:border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedCar.brand} {selectedCar.name}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      {selectedCar.description}
                    </p>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedCar.color} flex items-center justify-center shadow-lg`}>
                    <Car className="h-8 w-8 text-white" />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-muted/30 rounded-xl p-4 text-center">
                    <Zap className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedCar.specs.power}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Power</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-muted/30 rounded-xl p-4 text-center">
                    <Gauge className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedCar.specs.torque}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Torque</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-muted/30 rounded-xl p-4 text-center">
                    <Timer className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedCar.specs.acceleration}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">0-100</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-muted/30 rounded-xl p-4 text-center">
                    <Gauge className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedCar.specs.topSpeed} km/h</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Top Speed</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-muted/30 rounded-xl p-4 text-center">
                    <Fuel className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{selectedCar.specs.fuelType}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Fuel</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-muted/30 rounded-xl p-4 text-center">
                    <Car className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-slate-900 dark:text-white text-sm">{selectedCar.specs.transmission}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Transmission</div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 border-slate-700">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-4">
                    <h3 className="text-lg font-bold text-white">Acceleration Test</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </div>

                  <Speedometer speed={speed} maxSpeed={selectedCar.specs.topSpeed} />

                  <div className="flex items-center gap-4 mt-6 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white tabular-nums">{elapsedTime.toFixed(1)}s</div>
                      <div className="text-xs text-slate-400">Time</div>
                    </div>
                    <div className="h-8 w-px bg-slate-600" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{selectedCar.specs.topSpeed}</div>
                      <div className="text-xs text-slate-400">Max km/h</div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {!isSimulating ? (
                      <Button
                        onClick={startSimulation}
                        className="bg-primary hover:bg-primary/90 text-white font-bold px-8"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Test Drive
                      </Button>
                    ) : (
                      <Button
                        onClick={stopSimulation}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button
                      onClick={resetSimulation}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>

                  {speed >= selectedCar.specs.topSpeed && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 px-4 py-2 bg-primary/20 border border-primary/40 rounded-lg"
                    >
                      <span className="text-primary font-bold">🏁 Top Speed Reached in {elapsedTime.toFixed(1)}s!</span>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
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
