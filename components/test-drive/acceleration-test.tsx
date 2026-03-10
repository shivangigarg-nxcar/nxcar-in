"use client";

import { motion } from "framer-motion";
import { Button } from "@components/ui/button";
import { Card } from "@components/ui/card";
import { 
  Gauge, Fuel, Zap, Timer, Play, Pause, RotateCcw,
  Volume2, VolumeX, Car
} from "lucide-react";
import { Speedometer } from "./speedometer";
import type { CarModel } from "./car-selector";

interface AccelerationTestProps {
  selectedCar: CarModel;
  speed: number;
  elapsedTime: number;
  isSimulating: boolean;
  isMuted: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onToggleMute: () => void;
}

export function AccelerationTest({
  selectedCar, speed, elapsedTime, isSimulating, isMuted,
  onStart, onStop, onReset, onToggleMute,
}: AccelerationTestProps) {
  return (
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
              onClick={onToggleMute}
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
                onClick={onStart}
                className="bg-primary hover:bg-primary/90 text-white font-bold px-8"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Test Drive
              </Button>
            ) : (
              <Button
                onClick={onStop}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            <Button
              onClick={onReset}
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
  );
}
