"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
// ✅ Validation avec Zod
const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Type pour TypeScript
type FormData = z.infer<typeof schema>;

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // ✅ Soumission du formulaire
  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        reset(); // Réinitialiser le formulaire si envoi réussi
      } else {
        alert("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="bg-black">
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto py-20 px-4 text-white"
    >
      <h2 className="text-4xl font-bold text-accent mb-8 text-center">
        Contact Me
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Champ nom */}
        <div>
          <Input placeholder="Your Name" {...register("name")} />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Champ email */}
        <div>
          <Input placeholder="Your Email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Champ message */}
        <div>
          <Textarea placeholder="Your Message" {...register("message")} />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Bouton d'envoi */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="uppercase w-full"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>

        {/* Message succès */}
        {isSubmitSuccessful && (
          <p className="text-green-500 text-center mt-4">
            ✅ Message sent successfully!
          </p>
        )}
      </form>
    </motion.section></div>
  );
}
