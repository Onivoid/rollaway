"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ChatSettings {
  fontSize: "small" | "medium" | "large";
  showBadges: boolean;
  showTimestamps: boolean;
  highlightMentions: boolean;
  highlightMods: boolean;
  filteredKeywords?: string[]; // Nouveau
  filteredUsernames?: string[]; // Nouveau
  showOnlySubscribers?: boolean; // Nouveau
  showOnlyMods?: boolean; // Nouveau
  compactMode?: boolean; // Nouveau
}

interface ChatSettingsContextType {
  settings: ChatSettings;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
}

const defaultSettings: ChatSettings = {
  fontSize: "medium",
  showBadges: true,
  showTimestamps: true,
  highlightMentions: true,
  highlightMods: true,
  filteredKeywords: [],
  filteredUsernames: [],
  showOnlySubscribers: false,
  showOnlyMods: false,
  compactMode: false
};

const STORAGE_KEY = "chat-settings";

const ChatSettingsContext = createContext<ChatSettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {}, // Fonction vide par défaut
});

export function ChatSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des paramètres:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Erreur lors de la sauvegarde des paramètres:", error);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = (newSettings: Partial<ChatSettings>) => {
    console.log("Mise à jour des paramètres :", newSettings);
    setSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings,
    }));
  };

  return (
    <ChatSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ChatSettingsContext.Provider>
  );
}

export function useChatSettings() {
  const context = useContext(ChatSettingsContext);
  if (context === undefined) {
    throw new Error("useChatSettings must be used within a ChatSettingsProvider");
  }
  return context;
}