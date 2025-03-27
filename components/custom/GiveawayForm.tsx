"use client";

import { useGiveaway } from "@/context/GiveawayContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GiveawayForm() {
  const { command, setCommand, isCapturing } = useGiveaway();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration du Giveaway</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="command">Commande</Label>
            <Input 
              id="command"
              placeholder="!giveaway" 
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              disabled={isCapturing}
            />
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            Commande configurée: <code className="bg-muted p-1 rounded">{command || "Aucune"}</code>
          </p>
          {command && (
            <p className="mt-5">
              Les utilisateurs qui tapent <code className="bg-muted p-1 rounded">{command}</code> dans le chat seront ajoutés comme participants.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}