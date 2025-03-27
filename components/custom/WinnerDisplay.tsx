"use client";

import { useGiveaway } from "@/context/GiveawayContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/custom/Confetti";
import { useState, useEffect } from "react";

export function WinnerDisplay() {
  const { winner, resetWinner } = useGiveaway();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (winner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [winner]);

  if (!winner) return null;

  return (
    <>
      {showConfetti && <Confetti />}
      <Card className="border-indigo-500 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 w-md">
        <CardHeader className="bg-indigo-500 text-white">
          <CardTitle className="text-center py-6">Gagnant du Giveaway!</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-2xl font-bold">{winner}</h2>
            <Badge className="px-3 py-1 text-base bg-indigo-500">Félicitations!</Badge>
            
            <Button variant="outline" onClick={resetWinner} className="mt-4">
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}