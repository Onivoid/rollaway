"use client";

import { GiveawayProvider } from "@/context/GiveawayContext";
import { GiveawayForm } from "@/components/custom/GiveawayForm";
import { GiveawayControls } from "@/components/custom/GiveawayControls";
import { ParticipantList } from "@/components/custom/ParticipantList";
import { WinnerDisplay } from "@/components/custom/WinnerDisplay";
import { TwitchConnector } from "@/components/custom/TwitchConnector";

export default function Home() {
  return (
    <GiveawayProvider>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Système de Giveaway Twitch</h1>
          <p className="text-muted-foreground mt-2">
            Organisez facilement des tirages au sort sur votre stream Twitch
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            Développé par @Onivoid & <a href="https://github.com/Onivoid/rollaway" target="blank" className="text-indigo-500">Open Source sur GitHub</a>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <GiveawayForm />
            <GiveawayControls />
            <TwitchConnector />
          </div>
          
          <div className="md:col-span-2">
            <ParticipantList />
          </div>
        </div>

        {/* Modal for the winner */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <WinnerDisplay />
          </div>
        </div>
      </div>
    </GiveawayProvider>
  );
}