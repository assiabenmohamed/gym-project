"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Exercise,
  Program,
  Session,
  SessionCategory,
  User,
} from "../../types/session";
import SessionModal from "@/components/session/session-modal";
import SessionTable from "@/components/session/session-table";
import { usePDFGenerator } from "@/components/session/session-pdf";
export default function Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [user, setUser] = useState<User>();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [currentSession, setCurrentSession] = useState<Partial<Session>>({
    program: "",
    user: "",
    date: new Date(),
    categories: [],
  });
  const { generatePDF } = usePDFGenerator(sessions, programs, exercises);
  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock users with active programs
        // 1. Charger l'utilisateur connecté
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
          {
            credentials: "include",
          }
        );

        if (!userRes.ok) {
          console.error("Failed to fetch user data");
          return;
        }

        const mockUser = await userRes.json();

        // Mock exercises
        const exerciseRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/exercises`
        );

        if (!exerciseRes.ok) {
          console.error("Failed to fetch exercises");
          return;
        }
        const mockExercises = await exerciseRes.json();
        // Mock active programs only
        const programRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/programs/user/${mockUser._id}`,
          {
            credentials: "include",
          }
        );

        if (!programRes.ok) {
          console.error("Failed to fetch programs");
          return;
        }

        const mockPrograms = await programRes.json();
        console.log("mockPrograms", mockPrograms);

        const sessionRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sessions/user/${mockUser._id}`,
          {
            credentials: "include",
          }
        );

        if (!sessionRes.ok) {
          console.error("Failed to fetch sessions");
          return;
        }

        const mockSessions = await sessionRes.json();
        console.log("mockSessions", mockSessions);
        setUser(mockUser);
        setExercises(mockExercises);
        setPrograms(mockPrograms);
        setSessions(mockSessions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentUserActiveProgram = () => {
    return programs.find((p) => p.isActive);
  };

  const startNewSession = () => {
    const activeProgram = getCurrentUserActiveProgram();

    if (!activeProgram) {
      alert(
        "You don't have an active program. Please contact your trainer to get a program assigned."
      );
      return;
    }

    setCurrentSession({
      program: activeProgram._id,
      user: user?._id,
      date: new Date(),
      categories: [],
    });
    setSelectedProgram(activeProgram);

    // Auto-populate session structure from program
    const sessionCategories: SessionCategory[] = activeProgram.structure.map(
      (structure) => ({
        name: structure.name,
        exercises: structure.exercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.sets.map((set) => ({
            repetition: 0,
            weight: 0,
          })),
        })),
      })
    );

    setCurrentSession({
      program: activeProgram._id,
      user: user?._id,
      date: new Date(),
      categories: sessionCategories,
    });

    setIsModalOpen(true);
  };

  const handleEdit = (session: Session) => {
    setCurrentSession(session);
    const program = programs.find((p) => p._id === session.program);
    setSelectedProgram(program || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (sessionId: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}`, {
      method: "DELETE",
    });
    setSessions(sessions.filter((s) => s._id !== sessionId));
  };

  const handleProgramSelect = (programId: string) => {
    const program = getCurrentUserActiveProgram();
    if (program) {
      setSelectedProgram(program);
    }
  };

  const saveSession = async () => {
    try {
      if (currentSession._id) {
        // Update existing session
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sessions/${currentSession._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(currentSession),
          }
        );
        setSessions(
          sessions.map((s) =>
            s._id === currentSession._id ? (currentSession as Session) : s
          )
        );
      } else {
        // Create new session
        const newSession = {
          ...currentSession,
        } as Session;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/sessions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newSession),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to create session");
        }

        const data = await response.json();
        setSessions([...sessions, data.session]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const getExerciseName = (exerciseId: string) => {
    return (
      exercises.find((e) => e._id === exerciseId)?.name || "Unknown Exercise"
    );
  };

  const getProgramName = (programId: string) => {
    return programs.find((p) => p._id === programId)?.name || "Unknown Program";
  };

  const activeProgram = getCurrentUserActiveProgram();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workout Sessions</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generatePDF}>
            <FileText size={20} className="mr-2" />
            Export PDF
          </Button>{" "}
          <Button onClick={startNewSession} disabled={!activeProgram}>
            <Plus size={20} className="mr-2" />
            Start New Session
          </Button>
        </div>
      </div>
      {user && (
        <div>
          <div id="sessions-table">
            <SessionTable
              sessions={sessions}
              user={user}
              programs={programs}
              exercises={exercises}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          <SessionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            selectedProgram={selectedProgram}
            programs={programs}
            user={user}
            exercises={exercises}
            onSave={saveSession}
            onProgramSelect={handleProgramSelect}
          />
        </div>
      )}
    </div>
  );
}
