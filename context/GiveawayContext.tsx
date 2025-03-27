"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";

interface Participant {
  username: string;
  timestamp: number;
}

interface GiveawayContextType {
  participants: Participant[];
  command: string;
  setCommand: (cmd: string) => void;
  isCapturing: boolean;
  startCapture: () => void;
  stopCapture: () => void;
  addParticipant: (username: string) => void;
  clearParticipants: () => void;
  winner: string | null;
  rollWinner: () => void;
  resetWinner: () => void;
}

const GiveawayContext = createContext<GiveawayContextType | undefined>(undefined);

export function GiveawayProvider({ children }: { children: ReactNode }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [command, setCommand] = useState<string>("!giveaway");
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);

  const addParticipant = useCallback((username: string) => {
    console.log(`Tentative d'ajout du participant ${username}, capture: ${isCapturing}`);
    
    if (!isCapturing) {
      console.log("Capture désactivée, participant non ajouté");
      return;
    }
    
    setParticipants(prevParticipants => {
      if (prevParticipants.some(p => p.username.toLowerCase() === username.toLowerCase())) {
        console.log(`Participant doublé ignoré: ${username}`);
        return prevParticipants;
      }
      
      console.log(`Ajout du participant: ${username}`);
      const newParticipants = [...prevParticipants, { 
        username, 
        timestamp: Date.now() 
      }];
      console.log("Nouveaux participants:", newParticipants);
      return newParticipants;
    });
  }, [isCapturing]);

  const startCapture = useCallback(() => {
    console.log("Démarrage de la capture");
    setIsCapturing(true);
  }, []);
  
  const stopCapture = useCallback(() => {
    console.log("Arrêt de la capture");
    setIsCapturing(false);
  }, []);
  
  const clearParticipants = useCallback(() => {
    console.log("Effacement de tous les participants");
    setParticipants([]);
  }, []);

  const rollWinner = useCallback(() => {
    if (participants.length === 0) {
      console.log("Impossible de tirer un gagnant, aucun participant");
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * participants.length);
    console.log(`Tirage du gagnant: ${participants[randomIndex].username}`);
    setWinner(participants[randomIndex].username);
  }, [participants]);

  const resetWinner = useCallback(() => {
    console.log("Réinitialisation du gagnant");
    setWinner(null);
  }, []);

  useEffect(() => {
    console.log("GiveawayContext - État actuel:", {
      participants: participants.length,
      isCapturing,
      command,
      winner
    });
  }, [participants, isCapturing, command, winner]);

  const contextValue = React.useMemo(() => ({
    participants,
    command,
    setCommand,
    isCapturing,
    startCapture,
    stopCapture,
    addParticipant,
    clearParticipants,
    winner,
    rollWinner,
    resetWinner
  }), [
    participants, 
    command, 
    isCapturing, 
    startCapture, 
    stopCapture, 
    addParticipant, 
    clearParticipants, 
    winner, 
    rollWinner, 
    resetWinner
  ]);

  return (
    <GiveawayContext.Provider value={contextValue}>
      {children}
    </GiveawayContext.Provider>
  );
}

export function useGiveaway() {
  const context = useContext(GiveawayContext);
  if (context === undefined) {
    throw new Error("useGiveaway must be used within a GiveawayProvider");
  }
  return context;
}