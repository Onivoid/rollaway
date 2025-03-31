"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatSettings } from "@/context/ChatSettingsContext";

export function ChatFilters() {
    const { settings, updateSettings } = useChatSettings();
    const [keywordInput, setKeywordInput] = useState("");
    const [usernameInput, setUsernameInput] = useState("");

    const addKeywordFilter = () => {
        if (keywordInput.trim() && !settings.filteredKeywords?.includes(keywordInput.trim())) {
            updateSettings({
                filteredKeywords: [...(settings.filteredKeywords || []), keywordInput.trim()]
            });
            setKeywordInput("");
        }
    };

    const removeKeywordFilter = (keyword: string) => {
        updateSettings({
            filteredKeywords: (settings.filteredKeywords || []).filter(k => k !== keyword)
        });
    };

    const addUsernameFilter = () => {
        if (usernameInput.trim() && !settings.filteredUsernames?.includes(usernameInput.trim())) {
            updateSettings({
                filteredUsernames: [...(settings.filteredUsernames || []), usernameInput.trim()]
            });
            setUsernameInput("");
        }
    };

    const removeUsernameFilter = (username: string) => {
        updateSettings({
            filteredUsernames: (settings.filteredUsernames || []).filter(u => u !== username)
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Filtres du chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="text-sm font-medium">Mots-clés filtrés</div>
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Ajouter un mot-clé..."
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addKeywordFilter()}
                        />
                        <Button onClick={addKeywordFilter}>Ajouter</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {(settings.filteredKeywords || []).map(keyword => (
                            <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                                {keyword}
                                <X 
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => removeKeywordFilter(keyword)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="text-sm font-medium">Utilisateurs filtrés</div>
                    <div className="flex space-x-2">
                        <Input
                            placeholder="Nom d'utilisateur..."
                            value={usernameInput}
                            onChange={(e) => setUsernameInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addUsernameFilter()}
                        />
                        <Button onClick={addUsernameFilter}>Ajouter</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {(settings.filteredUsernames || []).map(username => (
                            <Badge key={username} variant="secondary" className="flex items-center gap-1">
                                {username}
                                <X 
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => removeUsernameFilter(username)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}