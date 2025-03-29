"use client";

import { useGiveaway } from "@/context/GiveawayContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export function GiveawayControls() {
  const { 
    isCapturing, 
    startCapture, 
    stopCapture, 
    rollWinner, 
    clearParticipants, 
    participants,
    winner,
    resetWinner
  } = useGiveaway();

  useEffect(() => {
    console.log("GiveawayControls - État de capture changé:", isCapturing);
  }, [isCapturing]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contrôles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {!isCapturing ? (
              <Button 
                onClick={() => {
                  console.log("Bouton Démarrer cliqué");
                  startCapture();
                  console.log("Après startCapture()");
                }} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Démarrer la capture
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  console.log("Bouton Arrêter cliqué");
                  stopCapture();
                  console.log("Après stopCapture()");
                }} 
                variant="destructive"
              >
                Arrêter la capture
              </Button>
            )}
            
            <Button 
              onClick={clearParticipants} 
              variant="outline"
            >
              Réinitialiser
            </Button>
          </div>

          <div>
            <Button 
              onClick={rollWinner} 
              className="w-full bg-purple-800 hover:bg-purple-800 text-white"
              disabled={participants.length === 0}
            >
              Tirer un gagnant
            </Button>
            
            {winner && (
              <Button
                onClick={resetWinner}
                variant="ghost" 
                className="w-full mt-2"
              >
                Réinitialiser le gagnant
              </Button>
            )}
          </div>
        </div>
        
          <p className="mt-1 text-xs">
            État de la capture: <strong className={isCapturing ? "text-green-500" : "text-red-500"}>
              {isCapturing ? 'Active' : 'Inactive'}
            </strong>
          </p>
      </CardContent>
    </Card>
  );
}