"use client";

import { useState, useEffect, useRef } from "react";
import tmi from "tmi.js";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatSettings } from "@/context/ChatSettingsContext";

interface ChatMessage {
    id: string;
    username: string;
    displayName: string;
    message: string;
    timestamp: Date;
    isAction: boolean;
    isMod: boolean;
    isSubscriber: boolean;
    isBroadcaster: boolean;
    isVip: boolean;
    isHighlighted: boolean;
    badges: Record<string, string>;
    color: string;
}

interface TwitchChatViewerProps {
    channelName: string;
}

export function TwitchChatViewer({ channelName }: TwitchChatViewerProps) {
    let settings;
    try {
        const chatSettings = useChatSettings();
        settings = chatSettings.settings;
        console.log("Paramètres du chat chargés :", settings);
    } catch (error) {
        console.error("Erreur lors du chargement du contexte de paramètres :", error);
        settings = {
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
    }
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connected, setConnected] = useState(false);
    const clientRef = useRef<tmi.Client | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const isConnectingRef = useRef(false);
    const currentChannelRef = useRef<string | null>(null);

    // Fonction de filtrage des messages
    const shouldDisplayMessage = useRef((msg: ChatMessage) => {
        // Filtrer par nom d'utilisateur
        if (settings.filteredUsernames && settings.filteredUsernames.length > 0) {
            if (settings.filteredUsernames.some(username => 
                msg.username.toLowerCase() === username.toLowerCase() ||
                msg.displayName.toLowerCase() === username.toLowerCase()
            )) {
                return false;
            }
        }

        // Filtrer par mot-clé dans le message
        if (settings.filteredKeywords && settings.filteredKeywords.length > 0) {
            if (settings.filteredKeywords.some(keyword => 
                msg.message.toLowerCase().includes(keyword.toLowerCase())
            )) {
                return false;
            }
        }

        // Filtrer pour n'afficher que les abonnés si nécessaire
        if (settings.showOnlySubscribers) {
            if (!msg.isSubscriber && !msg.isMod && !msg.isBroadcaster && !msg.isVip) {
                return false;
            }
        }

        // Filtrer pour n'afficher que les modérateurs si nécessaire
        if (settings.showOnlyMods) {
            if (!msg.isMod && !msg.isBroadcaster) {
                return false;
            }
        }

        return true;
    }).current;

    // Fonction pour déconnecter et nettoyer
    const disconnectAndCleanup = () => {
        console.log("Déconnexion et nettoyage");
        if (clientRef.current) {
            clientRef.current.disconnect();
            clientRef.current = null;
        }
        setConnected(false);
        isConnectingRef.current = false;
        setMessages([]); // Vider les messages
        currentChannelRef.current = null;
    };

    useEffect(() => {
        // Vérifier si le canal a changé
        if (currentChannelRef.current !== channelName) {
            // Déconnexion et nettoyage de l'ancienne connexion
            disconnectAndCleanup();
            // Mettre à jour le canal actuel
            currentChannelRef.current = channelName;
        }
        
        // Si aucun nom de canal ou déjà en cours de connexion ou déjà connecté, ne rien faire
        if (!channelName || isConnectingRef.current || clientRef.current) {
            return;
        }

        // Marquer comme en cours de connexion
        isConnectingRef.current = true;

        console.log(`Initialisation de la connexion au chat de ${channelName}`);

        // Créer une nouvelle instance du client Twitch
        const client = new tmi.Client({
            options: { debug: true },
            connection: {
                reconnect: true,
                secure: true,
            },
            channels: [channelName],
        });

        // Garder une référence au client
        clientRef.current = client;

        // Gérer les messages entrants
        client.on("message", (channel, tags, message, self) => {
            if (self) return;

            const isAction = message.startsWith("\u0001ACTION ") && message.endsWith("\u0001");
            const cleanedMessage = isAction 
                ? message.replace(/^\u0001ACTION /, "").replace(/\u0001$/, "") 
                : message;

            const newMessage: ChatMessage = {
                id: tags.id || `${Date.now()}-${Math.random()}`,
                username: tags.username || "anonymous",
                displayName: tags["display-name"] || tags.username || "anonymous",
                message: cleanedMessage,
                timestamp: new Date(),
                isAction,
                isMod: Boolean(tags.mod),
                isSubscriber: Boolean(tags.subscriber),
                isBroadcaster: tags.badges?.broadcaster === "1",
                isVip: tags.badges?.vip === "1",
                isHighlighted: tags["msg-id"] === "highlighted-message",
                badges: Object.fromEntries(
                    Object.entries(tags.badges || {}).filter(([_, value]) => value !== undefined)
                ) as Record<string, string>,
                color: tags.color || "#FFFFFF",
            };
            
            console.log(`Message reçu: ${newMessage.displayName}: ${newMessage.message}`);

            setMessages(prev => [...prev, newMessage]);
            
            // Faire défiler vers le bas
            setTimeout(() => {
                if (scrollAreaRef.current) {
                    scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
                }
            }, 0);
        });

        // Connexion au chat
        client.connect()
            .then(() => {
                console.log(`Connecté au chat de ${channelName}`);
                setConnected(true);
                isConnectingRef.current = false; // Connexion terminée
            })
            .catch(err => {
                console.error("Erreur de connexion:", err);
                isConnectingRef.current = false; // Connexion terminée (avec erreur)
                clientRef.current = null; // Réinitialiser le client en cas d'erreur
            });

        // Cleanup lors du démontage du composant
        return () => {
            disconnectAndCleanup();
        };
    }, [channelName]); // Dépendance uniquement sur channelName

    // Ne pas recréer ces fonctions à chaque rendu
    const adjustColor = useRef((color: string) => {
        if (!color || color === "#FFFFFF") {
            const hue = Math.floor(Math.random() * 360);
            return `hsl(${hue}, 70%, 70%)`;
        }
        return color;
    }).current;

    const renderBadges = useRef((badges: Record<string, string>) => {
        if (!settings.showBadges || !badges || Object.keys(badges).length === 0) {
            return null;
        }
        
        return Object.entries(badges).map(([badge, version]) => {
            let badgeText = badge;
            let badgeColor = "bg-gray-600";

            if (badge === "broadcaster") {
                badgeText = "STREAM";
                badgeColor = "bg-purple-600";
            } else if (badge === "moderator") {
                badgeText = "MOD";
                badgeColor = "bg-green-600";
            } else if (badge === "vip") {
                badgeText = "VIP";
                badgeColor = "bg-pink-600";
            } else if (badge === "subscriber") {
                badgeText = "SUB";
                badgeColor = "bg-blue-600";
            }

            return (
                <Badge key={badge} className={`mr-1 text-xs ${badgeColor}`}>
                    {badgeText}
                </Badge>
            );
        });
    }).current;

    const getFontSizeClass = useRef(() => {
        switch (settings.fontSize) {
            case "small": return "text-xs";
            case "large": return "text-lg";
            default: return "text-base";
        }
    }).current;

    console.log(`Rendu de TwitchChatViewer avec ${messages.length} messages`);

    return (
        <div className="h-full flex flex-col">
            <div className="relative flex-1 overflow-hidden">
                <ScrollArea className={`h-full p-4 ${getFontSizeClass()}`} ref={scrollAreaRef}>
                    {messages.length === 0 && connected ? (
                        <div className="text-center text-muted-foreground p-4">
                            En attente des messages...
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-muted-foreground p-4">
                            Connexion en cours...
                        </div>
                    ) : (
                        <ul className={`space-y-${settings.compactMode ? '1' : '2'}`}>
                            {messages.filter(shouldDisplayMessage).map(msg => {
                                let messageClasses = `rounded-md ${settings.compactMode ? 'py-1 px-2' : 'p-2'} `;
                                
                                if (msg.isHighlighted) {
                                    messageClasses += "bg-yellow-900/30 border border-yellow-600/50 ";
                                } else if (msg.isBroadcaster) {
                                    messageClasses += "bg-purple-900/30 border border-purple-600/50 ";
                                } else if (msg.isMod && settings.highlightMods) {
                                    messageClasses += "bg-green-900/30 border border-green-600/50 ";
                                } else if (msg.isVip) {
                                    messageClasses += "bg-pink-900/30 border border-pink-600/50 ";
                                } else if (msg.isSubscriber) {
                                    messageClasses += "bg-blue-900/30 border border-blue-600/50 ";
                                } else {
                                    messageClasses += "bg-neutral-800/30";
                                }

                                const hasMention = settings.highlightMentions && 
                                    msg.message.toLowerCase().includes('@' + channelName.toLowerCase());
                                
                                if (hasMention) {
                                    messageClasses += " border border-yellow-500 ";
                                }

                                return (
                                    <li key={msg.id} className={messageClasses}>
                                        <div className={`flex ${settings.compactMode ? 'items-baseline' : 'items-center'} space-x-1`}>
                                            {settings.showTimestamps && (
                                                <span className="text-xs text-muted-foreground">
                                                    {msg.timestamp.toLocaleTimeString()}
                                                </span>
                                            )}
                                            
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-1">
                                                    {renderBadges(msg.badges)}
                                                    <span 
                                                        style={{ color: adjustColor(msg.color) }}
                                                        className="font-medium"
                                                    >
                                                        {msg.displayName}
                                                    </span>
                                                    <span className="text-muted-foreground">:</span>
                                                </div>
                                                
                                                <div className={`${settings.compactMode ? '' : 'mt-1'} ${msg.isAction ? "italic" : ""}`}>
                                                    {msg.message}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}