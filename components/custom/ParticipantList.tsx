"use client";

import { useGiveaway } from "@/context/GiveawayContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function ParticipantList() {
  const { participants, isCapturing, winner } = useGiveaway();

  function formatTimestamp(timestamp: number) {
    return formatDistanceToNow(timestamp, { 
      addSuffix: true,
      locale: fr 
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Participants ({participants.length})</CardTitle>
        {isCapturing && (
          <Badge className="bg-green-600">Capture en cours</Badge>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom d&apos;utilisateur</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead className="text-right">Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Aucun participant pour le moment
                </TableCell>
              </TableRow>
            ) : (
              participants.map((participant) => (
                <TableRow 
                  key={`${participant.username}-${participant.timestamp}`}
                  className={winner === participant.username ? "bg-purple-100 dark:bg-purple-900/30" : ""}
                >
                  <TableCell className="font-medium">{participant.username}</TableCell>
                  <TableCell>{formatTimestamp(participant.timestamp)}</TableCell>
                  <TableCell className="text-right">
                    {winner === participant.username && (
                      <Badge className="bg-purple-800">Gagnant</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}