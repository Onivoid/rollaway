"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TwitchChatViewer } from "@/components/custom/TwitchChatViewer";
import { ChatSettings } from "@/components/custom/ChatSettings";
import { ChatFilters } from "@/components/custom/ChatFilters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings2, Filter } from "lucide-react";
import { ChatSettingsProvider } from "@/context/ChatSettingsContext";

export default function BetterChatPage() {
    const [channelName, setChannelName] = useState<string>("");
    const [isConnected, setIsConnected] = useState<boolean>(false);
    
    return (
        <ChatSettingsProvider>
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Better Chat for Twitch</h1>
                    <p className="text-muted-foreground mt-2">
                        Une meilleure expérience de chat pour les viewers et streamers
                    </p>
                </header>

                <Tabs defaultValue="chat" className="w-full">
                    <TabsList className="mb-6 mx-auto flex justify-center">
                        <TabsTrigger value="chat" className="gap-2">
                            <MessageSquare size={16} />
                            Chat
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-2">
                            <Settings2 size={16} />
                            Paramètres
                        </TabsTrigger>
                        <TabsTrigger value="filters" className="gap-2">
                            <Filter size={16} />
                            Filtres
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="chat">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-1">
                                <ChatSettings 
                                    channelName={channelName}
                                    setChannelName={setChannelName}
                                    isConnected={isConnected}
                                    setIsConnected={setIsConnected}
                                />
                            </div>
                            
                            <div className="md:col-span-3">
                                <Card className="h-[70vh]">
                                    <CardHeader>
                                        <CardTitle>Chat en direct</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 h-[calc(70vh-60px)]">
                                        {isConnected ? (
                                            <TwitchChatViewer channelName={channelName} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                                Connectez-vous à un canal pour voir le chat
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="settings">
                        <div className="max-w-xl mx-auto">
                            <ChatSettings 
                                channelName={channelName}
                                setChannelName={setChannelName}
                                isConnected={isConnected}
                                setIsConnected={setIsConnected}
                            />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="filters">
                        <div className="max-w-xl mx-auto">
                            <ChatFilters />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </ChatSettingsProvider>
    );
}