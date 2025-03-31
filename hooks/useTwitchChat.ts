"use client";

import { useState, useEffect, useRef } from "react";
import tmi from "tmi.js";

interface UseTwitchChatOptions {
    channel: string;
    onMessage: (username: string, message: string, tags: tmi.ChatUserstate) => void;
}

export function useTwitchChat({ channel, onMessage }: UseTwitchChatOptions) {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const clientRef = useRef<tmi.Client | null>(null);
    
    const onMessageRef = useRef(onMessage);
    
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const disconnectFromChat = () => {
        console.log("Déconnexion du chat...");
        if (clientRef.current) {
            clientRef.current.disconnect();
            clientRef.current = null;
            setIsConnected(false);
            console.log("Client déconnecté");
        }
    };

    const connectToChat = () => {
        if (!channel) {
            setError("Veuillez entrer un nom de chaîne");
            console.log("Tentative de connexion sans nom de chaîne");
            return disconnectFromChat;
        }

        try {
            disconnectFromChat();

            console.log(`Connexion au chat de ${channel}...`);
            const client = new tmi.Client({
                options: { debug: true },
                connection: {
                    reconnect: true,
                    secure: true,
                },
                channels: [channel],
            });

            client.on("message", (channelName, tags, message, self) => {
                console.log("Message reçu:", { channelName, username: tags.username, message, self });
                
                if (self) {
                    console.log("Message ignoré (envoyé par le bot)");
                    return;
                }

                const username = tags.username || tags["display-name"] || "anonyme";
                
                console.log(`Transmission du message: [${username}] ${message}`);
                onMessageRef.current(username, message, tags);
            });

            client.on("connected", (address, port) => {
                console.log(`Connecté au chat de ${channel} (${address}:${port})`);
                setIsConnected(true);
                setError(null);
            });

            client.on("disconnected", (reason) => {
                console.log("Déconnecté du chat:", reason);
                setIsConnected(false);
            });

            client.connect()
                .then(() => {
                    console.log("Connexion réussie");
                })
                .catch(err => {
                    console.error("Erreur de connexion:", err);
                    setError(`Erreur de connexion: ${err.message}`);
                    setIsConnected(false);
                });

            clientRef.current = client;

            return disconnectFromChat;
        } catch (err: any) {
            console.error("Erreur lors de la création du client:", err);
            setError(`Erreur: ${err.message}`);
            return disconnectFromChat;
        }
    };

    useEffect(() => {
        return () => {
            disconnectFromChat();
        };
    }, []);

    return {
        isConnected,
        error,
        connectToChat,
        disconnectFromChat,
    };
}