"use client";

import { useEffect, useState } from "react";
import { Twitch, Github, Star, Gift, Trophy, Heart, Crown } from "lucide-react";

export default function Home() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  const generateIconPositions = (count: number, radius: number) => {
    const icons = [
      <Twitch key="twitch" className="text-purple-800" />,
      <Github key="github" className="text-purple-800" />,
      <Star key="star" className="text-purple-800" />,
      <Gift key="gift" className="text-purple-800" />,
      <Trophy key="trophy" className="text-purple-800" />,
      <Heart key="heart" className="text-purple-800" />,
      <Crown key="crown" className="text-purple-800" />
    ];

    return icons.slice(0, count).map((icon, index) => {
      const angle = ((index * 360) / count + rotation) % 360;
      const x = radius * Math.cos((angle * Math.PI) / 180);
      const y = radius * Math.sin((angle * Math.PI) / 180);
      
      return (
        <div 
          key={index} 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background"
          style={{ 
            left: `calc(50% + ${x}px)`, 
            top: `calc(50% + ${y}px)`,
            transition: 'all 0.1s linear'
          }}
        >
          {icon}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative">
        {/* Cercle extérieur */}
        <div 
          className="absolute rounded-full border-2 border-purple-300/40"
          style={{ 
            width: "380px", 
            height: "380px", 
            left: "50%", 
            top: "50%", 
            transform: "translate(-50%, -50%)"
          }}
        ></div>
        
        {/* Icônes rotatives */}
        {generateIconPositions(7, 190)}
        
        {/* Contenu au centre */}
        <header className="z-10 relative mb-8 text-center p-8 rounded-lg backdrop-blur-sm">
          <h1 className="text-4xl font-bold tracking-tight">TwitchToolBox</h1>
          <p className="text-muted-foreground mt-2">
            Organisez facilement des tirages au sort sur votre stream Twitch
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            Développé par @Onivoid & <a href="https://github.com/Onivoid/rollaway" target="blank" className="text-purple-800">Open Source sur GitHub</a>
          </p>
        </header>
      </div>
    </div>
  );
}