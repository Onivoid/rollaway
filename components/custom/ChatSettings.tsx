"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useChatSettings } from "@/context/ChatSettingsContext";

interface ChatSettingsProps {
    channelName: string;
    setChannelName: (channel: string) => void;
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;
}

export function ChatSettings({ 
    channelName, 
    setChannelName, 
    isConnected, 
    setIsConnected 
}: ChatSettingsProps) {
    const { settings, updateSettings } = useChatSettings();

    const handleConnect = () => {
        if (channelName) {
            setIsConnected(true);
        }
    };

    const handleDisconnect = () => {
        setIsConnected(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Paramètres du chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="channel">Chaîne Twitch</Label>
                    <div className="flex space-x-2">
                        <Input
                            id="channel"
                            placeholder="nom_de_chaine"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                            disabled={isConnected}
                        />
                        {!isConnected ? (
                            <Button onClick={handleConnect} disabled={!channelName}>
                                Connecter
                            </Button>
                        ) : (
                            <Button variant="destructive" onClick={handleDisconnect}>
                                Déconnecter
                            </Button>
                        )}
                    </div>
                    {/* Removed error display since connection is managed by TwitchChatViewer */}
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold">Apparence</h3>
                    
                    <div className="flex justify-between items-center">
                        <Label htmlFor="font-size">Taille du texte</Label>
                        <Select 
                            value={settings.fontSize} 
                            onValueChange={(value) => updateSettings({ fontSize: value as "small" | "medium" | "large" })}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Taille" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="small">Petit</SelectItem>
                                <SelectItem value="medium">Moyen</SelectItem>
                                <SelectItem value="large">Grand</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <Label htmlFor="compact-mode">Mode compact</Label>
                        <Switch
                            id="compact-mode"
                            checked={settings.compactMode || false}
                            onCheckedChange={(checked) => updateSettings({ compactMode: checked })}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold">Options d&apos;affichage</h3>
                    
                    <div className="flex justify-between items-center">
                        <Label htmlFor="show-badges">Afficher les badges</Label>
                        <Switch
                            id="show-badges"
                            checked={settings.showBadges}
                            onCheckedChange={(checked) => updateSettings({ showBadges: checked })}
                        />
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <Label htmlFor="show-timestamps">Horodatage</Label>
                        <Switch
                            id="show-timestamps"
                            checked={settings.showTimestamps}
                            onCheckedChange={(checked) => updateSettings({ showTimestamps: checked })}
                        />
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <Label htmlFor="highlight-mentions">Surbrillance des mentions</Label>
                        <Switch
                            id="highlight-mentions"
                            checked={settings.highlightMentions}
                            onCheckedChange={(checked) => updateSettings({ highlightMentions: checked })}
                        />
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <Label htmlFor="highlight-mods">Surbrillance des modérateurs</Label>
                        <Switch
                            id="highlight-mods"
                            checked={settings.highlightMods}
                            onCheckedChange={(checked) => updateSettings({ highlightMods: checked })}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold">Filtres</h3>
                    
                    <div className="flex justify-between items-center">
                        <Label htmlFor="show-only-subs">Afficher uniquement les abonnés</Label>
                        <Switch
                            id="show-only-subs"
                            checked={settings.showOnlySubscribers || false}
                            onCheckedChange={(checked) => updateSettings({ showOnlySubscribers: checked })}
                        />
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <Label htmlFor="show-only-mods">Afficher uniquement les modérateurs</Label>
                        <Switch
                            id="show-only-mods"
                            checked={settings.showOnlyMods || false}
                            onCheckedChange={(checked) => updateSettings({ showOnlyMods: checked })}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}