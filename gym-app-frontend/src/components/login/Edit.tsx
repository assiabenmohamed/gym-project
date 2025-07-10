"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Define the type for form data
interface Trainer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Define the member interface for existing data
export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  address: string;
  gender: string;
  phoneNumber: string;
  trainerAssigned: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  goals: string[];
  medicalRestrictions: string;
  isOnline?: boolean;
}

type EditMemberProps = {
  open: boolean;
  setOpenAction: (open: boolean) => void;
  member: Member;
  role: "member" | "trainer";
  onSuccessAction: () => void;
  setSelectedMemberAction: (member: Member | null) => void;
};

export function EditMember({
  member,
  open,
  setOpenAction,
  role,
  onSuccessAction,
  setSelectedMemberAction,
}: EditMemberProps) {
  // États séparés pour chaque champ
  const [firstName, setFirstName] = useState(member.firstName || "");
  const [lastName, setLastName] = useState(member.lastName || "");
  const [email, setEmail] = useState(member.email || "");
  const [birthday, setBirthday] = useState(
    member.birthday ? member.birthday.split("T")[0] : ""
  );
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(member.address || "");
  const [gender, setGender] = useState(member.gender || "male");
  const [phoneNumber, setPhoneNumber] = useState(member.phoneNumber || "");
  const [trainerAssigned, setTrainerAssigned] = useState(
    member.trainerAssigned || ""
  );
  const [emergencyContactName, setEmergencyContactName] = useState(
    member.emergencyContactName || ""
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    member.emergencyContactPhone || ""
  );
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(
    member.emergencyContactRelation || ""
  );
  const [goals, setGoals] = useState<string[]>(member.goals || []);
  const [medicalRestrictions, setMedicalRestrictions] = useState(
    member.medicalRestrictions || ""
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [goalInput, setGoalInput] = useState<string>("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "none";
  }>({ message: "", type: "none" });

  // Ref pour gérer le focus
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Reset form when member changes
  useEffect(() => {
    if (!member) return;
    setFirstName(member.firstName || "");
    setLastName(member.lastName || "");
    setEmail(member.email || "");
    setBirthday(member.birthday ? member.birthday.split("T")[0] : "");
    setPassword("");
    setAddress(member.address || "");
    setGender(member.gender || "male");
    setPhoneNumber(member.phoneNumber || "");
    setTrainerAssigned(member.trainerAssigned || "");
    setEmergencyContactName(member.emergencyContactName || "");
    setEmergencyContactPhone(member.emergencyContactPhone || "");
    setEmergencyContactRelation(member.emergencyContactRelation || "");
    setGoals(member.goals || []);
    setMedicalRestrictions(member.medicalRestrictions || "");
    setErrors({});
    setNotification({ message: "", type: "none" });
  }, [member]);

  // Gestion du focus et de l'accessibilité
  useEffect(() => {
    if (open) {
      // Sauvegarder l'élément actuellement focusé
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Gérer les éléments avec aria-hidden
      const sidebarElements = document.querySelectorAll('[aria-hidden="true"]');
      const elementsToMakeInert: Element[] = [];

      sidebarElements.forEach((element) => {
        // Vérifier si l'élément contient des éléments focusables
        const focusableElements = element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
          // Utiliser inert au lieu d'aria-hidden pour les éléments avec du contenu focusable
          element.setAttribute("inert", "true");
          element.removeAttribute("aria-hidden");
          elementsToMakeInert.push(element);
        }
      });

      // Nettoyer au démontage
      return () => {
        elementsToMakeInert.forEach((element) => {
          element.removeAttribute("inert");
          element.setAttribute("aria-hidden", "true");
        });

        // Restaurer le focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [open]);

  useEffect(() => {
    async function fetchTrainers() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/trainers`,
          {
            credentials: "include",
          }
        );
        const trainers = await response.json();
        setTrainers(trainers);
      } catch (err) {
        console.error("Error fetching trainers:", err);
      }
    }
    fetchTrainers();
  }, []);

  const addGoal = () => {
    if (goalInput.trim() && !goals.includes(goalInput.trim())) {
      setGoals([...goals, goalInput.trim()]);
      setGoalInput("");
    }
  };

  const removeGoal = (goalToRemove: string) => {
    setGoals(goals.filter((goal) => goal !== goalToRemove));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!birthday.trim()) newErrors.birthday = "Birthday is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";

    // Email validation
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (only if password is provided for update)
    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Phone number validation
    if (phoneNumber && !/^[0-9+\-\s]{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Emergency contact phone validation
    if (
      emergencyContactPhone &&
      !/^[0-9+\-\s]{10,15}$/.test(emergencyContactPhone)
    ) {
      newErrors.emergencyContactPhone =
        "Please enter a valid emergency contact phone";
    }

    // Birthday validation
    if (birthday) {
      const birthdayDate = new Date(birthday);
      const today = new Date();
      if (birthdayDate >= today) {
        newErrors.birthday = "Birthday must be in the past";
      }
    }

    // Trainer assignment validation for members
    if (role === "member" && !trainerAssigned) {
      newErrors.trainerAssigned = "Please assign a trainer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setOpenAction(false);
    setSelectedMemberAction(null);
    setNotification({ message: "", type: "none" });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setNotification({
        message: "Please correct the errors in the form",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    setNotification({ message: "", type: "none" });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${member._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            email,
            firstName,
            lastName,
            birthday,
            password: password || undefined,
            address,
            gender,
            phoneNumber,
            trainerAssigned,
            emergencyContact: {
              name: emergencyContactName,
              phone: emergencyContactPhone,
              relation: emergencyContactRelation,
            },
            goals,
            medicalRestrictions,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Success", {
          description: `The ${role} was updated successfully.`,
        });
        onSuccessAction?.();
        handleClose();
      } else {
        setNotification({
          message: result.message || `Failed to update ${role}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error updating member", error);
      setNotification({
        message: "There was an error updating the member",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des touches clavier pour l'accessibilité
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isSubmitting) {
      handleClose();
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !isSubmitting) {
      handleSubmit();
    }
  };

  if (!member) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={setOpenAction}
      modal={true} // Force modal behavior
    >
      <DialogContent
        ref={dialogRef}
        className="w-[95vw] max-w-[750px] max-h-[95vh] overflow-y-auto focus:outline-none"
        onKeyDown={handleKeyDown}
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Edit className="text-accent" aria-hidden="true" />
            Update {role === "member" ? "Member" : "Trainer"} Information
          </DialogTitle>
          <DialogDescription id="dialog-description">
            Update the {role} details and save changes. Use Ctrl+Enter to submit
            or Escape to close.
          </DialogDescription>
        </DialogHeader>

        {/* Notification banner */}
        {notification.type !== "none" && (
          <div
            className={`p-3 rounded-md mb-4 flex items-center justify-between ${
              notification.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-600"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
              {notification.message}
            </div>
            <button
              onClick={() => setNotification({ message: "", type: "none" })}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded"
              aria-label="Close notification"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        )}

        <Card className="p-4 border-t border-gray-200 my-4">
          <div className="grid gap-6 py-2">
            {/* Personal Information Section */}
            <fieldset className="space-y-4">
              <legend className="font-medium text-sm text-gray-500 uppercase tracking-wide border-b pb-2 w-full">
                Personal Information
              </legend>

              {/* First row - First and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name{" "}
                    <span className="text-red-500 ml-1" aria-label="required">
                      *
                    </span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) {
                        setErrors({ ...errors, firstName: "" });
                      }
                    }}
                    placeholder="John"
                    className={errors.firstName ? "border-red-500" : ""}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={
                      errors.firstName ? "firstName-error" : undefined
                    }
                  />
                  {errors.firstName && (
                    <p
                      id="firstName-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name{" "}
                    <span className="text-red-500 ml-1" aria-label="required">
                      *
                    </span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) {
                        setErrors({ ...errors, lastName: "" });
                      }
                    }}
                    placeholder="Doe"
                    className={errors.lastName ? "border-red-500" : ""}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={
                      errors.lastName ? "lastName-error" : undefined
                    }
                  />
                  {errors.lastName && (
                    <p
                      id="lastName-error"
                      className="text-red-500 text-xs mt-1"
                      role="alert"
                    >
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email{" "}
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  placeholder="john.doe@example.com"
                  className={errors.email ? "border-red-500" : ""}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p
                    id="email-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Gender{" "}
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                </Label>
                <RadioGroup
                  value={gender}
                  onValueChange={setGender}
                  className="flex space-x-4"
                  aria-label="Select gender"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="male"
                      id="male"
                      className="border-blue-400 text-blue-600"
                    />
                    <Label htmlFor="male" className="cursor-pointer">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="female"
                      id="female"
                      className="border-pink-400 text-pink-600"
                    />
                    <Label htmlFor="female" className="cursor-pointer">
                      Female
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </fieldset>

            {/* Contact Information Section */}
            <fieldset className="space-y-4">
              <legend className="font-medium text-sm text-gray-500 uppercase tracking-wide border-b pb-2 w-full">
                Contact Information
              </legend>

              {/* Birthday field */}
              <div className="space-y-2">
                <Label htmlFor="birthday" className="text-sm font-medium">
                  Birthday{" "}
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                </Label>
                <Input
                  id="birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => {
                    setBirthday(e.target.value);
                    if (errors.birthday) {
                      setErrors({ ...errors, birthday: "" });
                    }
                  }}
                  className={errors.birthday ? "border-red-500" : ""}
                  aria-invalid={!!errors.birthday}
                  aria-describedby={
                    errors.birthday ? "birthday-error" : undefined
                  }
                />
                {errors.birthday && (
                  <p
                    id="birthday-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.birthday}
                  </p>
                )}
              </div>

              {/* Phone Number field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">
                  Phone Number{" "}
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phoneNumber) {
                      setErrors({ ...errors, phoneNumber: "" });
                    }
                  }}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                  aria-invalid={!!errors.phoneNumber}
                  aria-describedby={
                    errors.phoneNumber ? "phoneNumber-error" : undefined
                  }
                />
                {errors.phoneNumber && (
                  <p
                    id="phoneNumber-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Address field */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address{" "}
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) {
                      setErrors({ ...errors, address: "" });
                    }
                  }}
                  placeholder="123 Main St, City, State, ZIP"
                  className={errors.address ? "border-red-500" : ""}
                  aria-invalid={!!errors.address}
                  aria-describedby={
                    errors.address ? "address-error" : undefined
                  }
                />
                {errors.address && (
                  <p
                    id="address-error"
                    className="text-red-500 text-xs mt-1"
                    role="alert"
                  >
                    {errors.address}
                  </p>
                )}
              </div>
            </fieldset>

            {role === "member" && (
              <>
                {/* Emergency Contact Section */}
                <fieldset className="space-y-4">
                  <legend className="font-medium text-sm text-gray-500 uppercase tracking-wide border-b pb-2 w-full">
                    Emergency Contact
                  </legend>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="emergencyContactName"
                        className="text-sm font-medium"
                      >
                        Contact Name
                      </Label>
                      <Input
                        id="emergencyContactName"
                        type="text"
                        value={emergencyContactName}
                        onChange={(e) =>
                          setEmergencyContactName(e.target.value)
                        }
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="emergencyContactPhone"
                        className="text-sm font-medium"
                      >
                        Contact Phone
                      </Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        value={emergencyContactPhone}
                        onChange={(e) => {
                          setEmergencyContactPhone(e.target.value);
                          if (errors.emergencyContactPhone) {
                            setErrors({ ...errors, emergencyContactPhone: "" });
                          }
                        }}
                        placeholder="+1 (555) 987-6543"
                        className={
                          errors.emergencyContactPhone ? "border-red-500" : ""
                        }
                        aria-invalid={!!errors.emergencyContactPhone}
                        aria-describedby={
                          errors.emergencyContactPhone
                            ? "emergencyContactPhone-error"
                            : undefined
                        }
                      />
                      {errors.emergencyContactPhone && (
                        <p
                          id="emergencyContactPhone-error"
                          className="text-red-500 text-xs mt-1"
                          role="alert"
                        >
                          {errors.emergencyContactPhone}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relation" className="text-sm font-medium">
                        Relationship
                      </Label>
                      <Select
                        onValueChange={setEmergencyContactRelation}
                        value={emergencyContactRelation}
                      >
                        <SelectTrigger aria-label="Select relationship">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </fieldset>

                {/* Fitness Information Section */}
                <fieldset className="space-y-4">
                  <legend className="font-medium text-sm text-gray-500 uppercase tracking-wide border-b pb-2 w-full">
                    Fitness Information
                  </legend>

                  {/* Goals Section */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fitness Goals</Label>
                    <div className="flex gap-2">
                      <Input
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        placeholder="Add a fitness goal"
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addGoal();
                          }
                        }}
                        aria-label="Enter fitness goal"
                      />
                      <Button
                        type="button"
                        onClick={addGoal}
                        variant="outline"
                        size="sm"
                        aria-label="Add fitness goal"
                      >
                        Add
                      </Button>
                    </div>
                    {goals.length > 0 && (
                      <div
                        className="flex flex-wrap gap-2 mt-2"
                        role="list"
                        aria-label="Current fitness goals"
                      >
                        {goals.map((goal, index) => (
                          <div
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm flex items-center gap-2"
                            role="listitem"
                          >
                            {goal}
                            <button
                              type="button"
                              onClick={() => removeGoal(goal)}
                              className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                              aria-label={`Remove goal: ${goal}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Medical Restrictions */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="medicalRestrictions"
                      className="text-sm font-medium"
                    >
                      Medical Restrictions
                    </Label>
                    <Textarea
                      id="medicalRestrictions"
                      value={medicalRestrictions}
                      onChange={(e) => setMedicalRestrictions(e.target.value)}
                      placeholder="Any medical conditions, allergies, or physical limitations..."
                      className="min-h-[100px]"
                    />
                  </div>
                </fieldset>

                {/* Assignment Section */}
                {trainers.length > 0 && (
                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">
                      Assigned Trainer{" "}
                      <span className="text-red-500 ml-1" aria-label="required">
                        *
                      </span>
                    </legend>
                    <Select
                      onValueChange={setTrainerAssigned}
                      value={trainerAssigned}
                    >
                      <SelectTrigger
                        className={
                          errors.trainerAssigned ? "border-red-500" : ""
                        }
                        aria-invalid={!!errors.trainerAssigned}
                        aria-describedby={
                          errors.trainerAssigned
                            ? "trainerAssigned-error"
                            : undefined
                        }
                      >
                        <SelectValue placeholder="Select a trainer" />
                      </SelectTrigger>
                      <SelectContent>
                        {trainers.map((trainer, index) => (
                          <SelectItem key={index} value={trainer._id}>
                            {trainer.firstName} {trainer.lastName} (
                            {trainer.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.trainerAssigned && (
                      <p
                        id="trainerAssigned-error"
                        className="text-red-500 text-sm mt-1"
                        role="alert"
                      >
                        {errors.trainerAssigned}
                      </p>
                    )}
                  </fieldset>
                )}
              </>
            )}
          </div>
        </Card>

        <DialogFooter className="flex gap-2 justify-end pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-300 hover:bg-gray-100 bg-transparent"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-accent/90 hover:bg-accent text-white flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="sr-only">Loading...</span>
                Updating...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Update {role === "member" ? "Member" : "Trainer"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
