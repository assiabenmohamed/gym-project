import { useState, useEffect } from "react";
import { UserCheck, UserX, Calendar, Clock, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "./dashboardAdmin";

// Type pour un membre

// Type pour un enregistrement de présence
type AttendanceRecord = {
  memberId: string;
  memberName: string;
  membershipType: string;
  checkInTime: string;
  date: string;
};

export default function AttendanceTracker({ members }: { members: User[] }) {
  // Liste des membres (normalement viendrait d'une base de données)

  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Filtrer les membres en fonction du terme de recherche
  const filteredMembers = (members || []).filter((member) =>
    `${member.firstName ?? ""} ${member.lastName ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Marquer un membre comme présent
  const markPresent = async () => {
    if (!selectedMemberId) return;

    const member = members.find((m) => m._id === selectedMemberId);
    if (!member || !member.email) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/attendance/mark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: member.email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Une erreur est survenue.");
        return;
      }

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const currentTime = `${hours}:${minutes}`;

      setSelectedMemberId("");

      alert("Présence enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur de présence :", error);
      alert("Erreur serveur. Réessaie plus tard.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 ">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Gym Attendance Tracker</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{currentDate}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="search" className="text-sm font-medium">
              Search Member
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Type member name..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2  ">
            <label htmlFor="member-select" className="text-sm font-medium">
              Select Member
            </label>
            <Select
              value={selectedMemberId}
              onValueChange={setSelectedMemberId}
            >
              <SelectTrigger id="member-select">
                <SelectValue placeholder="Choose a member..." />
              </SelectTrigger>
              <SelectContent>
                {filteredMembers.map((member) => (
                  <SelectItem
                    key={member._id}
                    value={member._id}
                    className="focus:bg-blue-600  "
                  >
                    {member.lastName}, {member.firstName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={markPresent}
            disabled={!selectedMemberId}
            className="w-full"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Mark Present
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
