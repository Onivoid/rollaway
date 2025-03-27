"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTwitchChat } from '@/hooks/useTwitchChat';
import { useGiveaway } from '@/context/GiveawayContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function TwitchConnector() {
  const [channelName, setChannelName] = useState('');
  const { command, addParticipant, isCapturing } = useGiveaway();
  
  const isCapturingRef = useRef(isCapturing);
  
  useEffect(() => {
    isCapturingRef.current = isCapturing;
    console.log("isCapturingRef mis à jour:", isCapturingRef.current);
  }, [isCapturing]);

  const handleMessage = useCallback((username: string, message: string) => {
    const currentIsCapturing = isCapturingRef.current;
    console.log(`Message reçu: [${username}] ${message}, isCapturing actuel: ${currentIsCapturing}`);
    
    const trimmedCommand = command.trim().toLowerCase();
    const trimmedMessage = message.trim().toLowerCase();
    
    if (trimmedMessage === trimmedCommand) {
      console.log(`Commande valide détectée: ${command}, tentative d'ajout de ${username}`);
      addParticipant(username);
    } else {
      console.log(`Message non reconnu comme commande: ${message} vs ${command}`);
    }
  }, [command, addParticipant]);
  
  const { isConnected, error, connectToChat, disconnectFromChat } = useTwitchChat({
    channel: channelName,
    onMessage: handleMessage
  });

  useEffect(() => {
    console.log("TwitchConnector - État de capture changé:", isCapturing);
  }, [isCapturing]);

  const handleConnect = () => {
    if (channelName) {
      console.log(`Tentative de connexion au chat de ${channelName}`);
      connectToChat();
    }
  };

  const handleDisconnect = () => {
    console.log(`Déconnexion du chat de ${channelName}`);
    disconnectFromChat();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Connexion Twitch
          {isConnected && <Badge className="bg-green-600">Connecté</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel">Nom de la chaîne</Label>
            <Input
              id="channel"
              placeholder="votre_chaine"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              disabled={isConnected}
            />
          </div>
          
          {!isConnected ? (
            <Button 
              onClick={handleConnect} 
              disabled={!channelName} 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Connecter au chat
            </Button>
          ) : (
            <Button 
              onClick={handleDisconnect} 
              variant="destructive"
              className="w-full"
            >
              Déconnecter du chat
            </Button>
          )}
        </div>
        
      </CardContent>
    </Card>
  );
}