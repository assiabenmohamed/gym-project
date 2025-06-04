"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LiaUserEditSolid } from "react-icons/lia";

// Type de données utilisateur
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  password: string;
  address: string;
  gender: string;
  phoneNumber: string;
  membershipType: string;
  currentWeight: string;
  height: string;
}

export function EditMember({ id }: { id: string }) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    password: "",
    address: "",
    gender: "male",
    phoneNumber: "",
    membershipType: "",
    currentWeight: "",
    height: "",
  });

  // ✅ Charger les données utilisateur au montage
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/me/${id}`,
          {
            credentials: "include",
          }
        );
        const user = await res.json();
        console.log(user);
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          birthday: user.birthday || "",
          password: "", // Ne pas pré-remplir le mot de passe
          address: user.address || "",
          gender: user.gender || "male",
          phoneNumber: user.phoneNumber || "",
          membershipType: user.membershipType || "",
          currentWeight: user.currentWeight || "",
          height: user.height || "",
        });
      } catch (error) {
        console.error("Erreur chargement user", error);
      }
    }

    fetchUser();
  }, [id]);

  // ✅ Gestion des changements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Fonction de mise à jour
  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        alert("User updated!");
      } else {
        const err = await res.json();
        alert("Update failed: " + err.message);
      }
    } catch (error) {
      console.error("Erreur mise à jour", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="  hover:bg-gray-100 w-full">
          <LiaUserEditSolid /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>Update the member details</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4">
          {[
            "firstName",
            "lastName",
            "email",
            "birthday",
            "address",
            "phoneNumber",
            "membershipType",
            "currentWeight",
            "height",
          ].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>{field}</Label>
              <Input
                type="text"
                name={field}
                id={field}
                value={(formData as any)[field]}
                onChange={handleChange}
              />
            </div>
          ))}
        </form>

        <DialogFooter>
          <Button onClick={handleUpdate}>Update Member</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
