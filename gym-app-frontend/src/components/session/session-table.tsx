import type React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar } from "lucide-react";
import type {
  Session,
  User as UserType,
  Program,
  Exercise,
} from "@/app/(users)/types/session";
import { Button } from "../ui/button";

interface SessionTableProps {
  sessions: Session[];
  user: UserType;
  programs: Program[];
  exercises: Exercise[];
  onEdit: (session: Session) => void;
  onDelete: (sessionId: string) => void;
}

export default function SessionTable({
  sessions,
  user,
  programs,
  exercises,
  onEdit,
  onDelete,
}: SessionTableProps) {
  const getExerciseName = (exerciseId: string) => {
    return (
      exercises.find((e) => e._id === exerciseId)?.name || "Unknown Exercise"
    );
  };

  const getProgramName = (programId: string) => {
    return programs.find((p) => p._id === programId)?.name || "Unknown Program";
  };

  const handleDelete = (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      onDelete(sessionId);
    }
  };

  // Filter sessions to only show those with active programs
  const activeSessions = sessions.filter((session) => {
    const program = programs.find((p) => p._id === session.program);
    return program && program.isActive;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Exercises</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activeSessions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-8 text-muted-foreground"
              >
                No sessions found. Start your first workout session!
              </TableCell>
            </TableRow>
          ) : (
            activeSessions.map((session) => (
              <TableRow key={session._id}>
                <TableCell className="font-medium">
                  {getProgramName(session.program)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {session.categories.map((category, categoryIndex) => (
                      <Badge
                        key={categoryIndex}
                        variant="outline"
                        className="block w-fit"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {session.categories.map((category, categoryIndex) => (
                      <div
                        key={categoryIndex}
                        className="border-l-2 border-primary/20 pl-2"
                      >
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          {category.name}
                        </div>
                        <div className="space-y-1">
                          {category.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="text-sm">
                              <div className="font-medium text-primary">
                                {getExerciseName(exercise.name)}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {exercise.sets.map((set, setIndex) => (
                                  <span
                                    key={setIndex}
                                    className="bg-muted px-2 py-1 rounded text-xs"
                                  >
                                    {set.repetition} reps{" "}
                                    {set.weight ? `× ${set.weight}kg` : ""}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(session)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(session._id!)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
