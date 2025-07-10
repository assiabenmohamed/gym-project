"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CgUserAdd } from "react-icons/cg";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IoPersonAddOutline } from "react-icons/io5";

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

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  password: string;
  address: string;
  gender: string;
  phoneNumber: string;
  trainerAssigned?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  goals: string[];
  medicalRestrictions: string;
}

// Define field type for form field mapping
interface FormField {
  name: keyof FormData;
  label: string;
  type: string;
  gridCols: number;
  required?: boolean;
  placeholder?: string;
}

export function AddMember({
  role,
  onSuccess,
}: {
  role: string;
  onSuccess?: () => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    password: "",
    address: "",
    gender: "male",
    phoneNumber: "",
    trainerAssigned: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    goals: [],
    medicalRestrictions: "",
  });

  const [fileName, setFileName] = useState<string>("No file chosen");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [goalInput, setGoalInput] = useState<string>("");

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "none";
  }>({ message: "", type: "none" });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const profileImageRef = useRef<File | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log("Fetching trainers..."); // 👈 test

    async function fetchTrainers() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/trainers`,
          {
            credentials: "include", // ✅ allow sending cookies (JWT)
          }
        );

        const trainers = await response.json();
        console.log(trainers);
        setTrainers(trainers);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    }

    fetchTrainers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSelect = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Clear error for this field when user selects a value
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFileName(e.target.files[0].name);
      profileImageRef.current = e.target.files[0];
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addGoal = () => {
    if (goalInput.trim() && !formData.goals.includes(goalInput.trim())) {
      setFormData({
        ...formData,
        goals: [...formData.goals, goalInput.trim()],
      });
      setGoalInput("");
    }
  };

  const removeGoal = (goalToRemove: string) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((goal) => goal !== goalToRemove),
    });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Required fields
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    if (!formData.birthday.trim()) newErrors.birthday = "Birthday is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation (minimum 6 characters)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Phone number validation (basic)
    if (
      formData.phoneNumber &&
      !/^[0-9+\-\s]{10,15}$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Emergency contact phone validation
    if (
      formData.emergencyContactPhone &&
      !/^[0-9+\-\s]{10,15}$/.test(formData.emergencyContactPhone)
    ) {
      newErrors.emergencyContactPhone =
        "Please enter a valid emergency contact phone";
    }

    // Birthday validation (must be in the past)
    if (formData.birthday) {
      const birthdayDate = new Date(formData.birthday);
      const today = new Date();
      if (birthdayDate >= today) {
        newErrors.birthday = "Birthday must be in the past";
      }
    }

    // Trainer assignment validation for members
    if (role === "member" && !formData.trainerAssigned) {
      newErrors.trainerAssigned = "Please assign a trainer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      const form = new FormData();

      // Add text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "goals") {
          form.append(key, JSON.stringify(value));
        } else if (key.startsWith("emergencyContact")) {
          // Handle emergency contact fields specially
          const emergencyContactKey = key
            .replace("emergencyContact", "")
            .toLowerCase();
          form.append(
            `emergencyContact[${emergencyContactKey}]`,
            value as string
          );
        } else {
          form.append(key, value as string);
        }
      });

      // Add image file if it exists
      if (profileImageRef.current) {
        form.append("profileImage", profileImageRef.current);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          method: "POST",
          body: form,
          credentials: "include", // Necessary for cookies to be sent
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Succès", {
          description: "The member was added successfully.",
        });
        onSuccess?.();
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          birthday: "",
          password: "",
          address: "",
          gender: "male",
          phoneNumber: "",
          trainerAssigned: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelation: "",
          goals: [],
          medicalRestrictions: "",
        });
        setFileName("No file chosen");
        profileImageRef.current = null;
        setGoalInput("");

        // Close dialog after a short delay to show success message
        setTimeout(() => {
          setOpen(false);
          setNotification({ message: "", type: "none" });
        }, 1500);
      } else {
        setNotification({
          message: result.message || `Failed to add ${role}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error submitting form", error);
      setNotification({
        message: "There was an error submitting the form",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form fields definition for mapping
  const formFields: FormField[] = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      gridCols: 2,
      required: true,
      placeholder: "John",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      gridCols: 2,
      required: true,
      placeholder: "Doe",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      gridCols: 4,
      required: true,
      placeholder: "john.doe@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      gridCols: 4,
      required: true,
      placeholder: "••••••••",
    },
    {
      name: "birthday",
      label: "Birthday",
      type: "date",
      gridCols: 4,
      required: true,
      placeholder: "YYYY-MM-DD",
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "tel",
      gridCols: 4,
      required: true,
      placeholder: "+1 (555) 123-4567",
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      gridCols: 4,
      required: true,
      placeholder: "123 Main St, City, State, ZIP",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className=" hover:text-white shadow-md flex items-center gap-2 text-accent"
        >
          <IoPersonAddOutline />
          Add {role === "member" ? "Member" : "Trainer"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CgUserAdd className="text-accent" />
            New {role === "member" ? "Member" : "Trainer"} Registration
          </DialogTitle>
          <DialogDescription>
            Enter the new {role} details to create an account
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
              className="text-gray-500 hover:text-gray-700"
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
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide border-b pb-2">
                Personal Information
              </h3>

              {/* First row - First and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                {formFields.slice(0, 2).map((field) => (
                  <div className="space-y-2" key={field.name}>
                    <Label htmlFor={field.name} className="text-sm font-medium">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`${errors[field.name] ? "border-red-500 focus:ring-red-500" : ""} focus:!outline-none focus:!ring-0`}
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Email and Password fields */}
              {formFields.slice(2, 4).map((field) => (
                <div className="space-y-2" key={field.name}>
                  <Label htmlFor={field.name} className="text-sm font-medium">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>

                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={
                        field.type === "password" && showPassword
                          ? "text"
                          : field.type
                      }
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className={`${errors[field.name] ? "border-red-500 focus:ring-red-500" : ""} pr-10  focus:!outline-none focus:!ring-0`}
                    />

                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-2 flex items-center text-sm text-gray-500"
                      >
                        {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
                      </button>
                    )}
                  </div>

                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              {/* Gender Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Gender <span className="text-red-500 ml-1">*</span>
                </Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                  className="flex space-x-4"
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
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide border-b pb-2">
                Contact Information
              </h3>

              {/* Birthday, Phone Number, and Address fields */}
              {formFields.slice(4, 7).map((field) => (
                <div className="space-y-2" key={field.name}>
                  <Label htmlFor={field.name} className="text-sm font-medium">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`${errors[field.name] ? "border-red-500 focus:ring-red-500" : ""} focus:!outline-none focus:!ring-0`}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {role === "member" && (
              <div>
                {/* Emergency Contact Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide border-b pb-2">
                    Emergency Contact
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="emergencyContactName"
                        className="text-sm font-medium"
                      >
                        Contact Name
                      </Label>
                      <Input
                        id="emergencyContactName"
                        name="emergencyContactName"
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="focus:!outline-none focus:!ring-0"
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
                        name="emergencyContactPhone"
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={handleChange}
                        placeholder="+1 (555) 987-6543"
                        className={`${errors.emergencyContactPhone ? "border-red-500 focus:ring-red-500" : ""} focus:!outline-none focus:!ring-0`}
                      />
                      {errors.emergencyContactPhone && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.emergencyContactPhone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="emergencyContactRelation"
                        className="text-sm font-medium"
                      >
                        Relationship
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          handleSelect("emergencyContactRelation", value)
                        }
                        value={formData.emergencyContactRelation}
                      >
                        <SelectTrigger>
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
                </div>

                {/* Fitness Information Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wide border-b pb-2">
                    Fitness Information
                  </h3>

                  {/* Goals Section */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Fitness Goals</Label>
                    <div className="flex gap-2">
                      <Input
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        placeholder="Add a fitness goal"
                        className="flex-1 focus:!outline-none focus:!ring-0"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addGoal();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addGoal}
                        variant="outline"
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                    {formData.goals.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.goals.map((goal, index) => (
                          <div
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {goal}
                            <button
                              type="button"
                              onClick={() => removeGoal(goal)}
                              className="text-blue-600 hover:text-blue-800"
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
                      name="medicalRestrictions"
                      value={formData.medicalRestrictions}
                      onChange={handleChange}
                      placeholder="Any medical conditions, allergies, or physical limitations..."
                      className="min-h-[80px] focus:!outline-none focus:!ring-0"
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Assignment Section */}
            <div className="space-y-4">
              {trainers.length > 0 && role === "member" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Assigned Trainer{" "}
                    <span className="text-red-500 ml-1">*</span>
                  </Label>

                  <Select
                    onValueChange={(value) =>
                      handleSelect("trainerAssigned", value)
                    }
                    value={formData.trainerAssigned}
                  >
                    <SelectTrigger
                      className={`${
                        errors.trainerAssigned
                          ? "border-red-500 focus:ring-red-500"
                          : ""
                      }`}
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.trainerAssigned}
                    </p>
                  )}
                </div>
              )}

              {/* Profile Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="profileImage" className="text-sm font-medium">
                  Profile Image
                </Label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    id="profileImage"
                    name="profileImage"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden focus:!outline-none focus:!ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                    className="flex-shrink-0 flex items-center gap-2 hover:bg-gray-100"
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
                      className="lucide lucide-image-plus"
                    >
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
                      <line x1="16" x2="22" y1="5" y2="5" />
                      <line x1="19" x2="19" y1="2" y2="8" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                    </svg>
                    Upload Image
                  </Button>
                  <div className="truncate border rounded p-2 flex-grow text-sm text-gray-500 bg-gray-50 flex items-center">
                    {fileName}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Recommended: Square image, at least 300x300px
                </p>
              </div>
            </div>
          </div>
        </Card>
        <DialogFooter className="flex gap-2 justify-end pt-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-300 hover:bg-gray-100"
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
                Processing...
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
                  className="lucide lucide-save"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save {role === "member" ? "Member" : "Trainer"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
