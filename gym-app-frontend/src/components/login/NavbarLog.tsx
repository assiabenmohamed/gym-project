import { User } from "@/app/page"; // Assurez-vous que 'User' est bien exporté depuis la page correcte
import Image from "next/image";
import React from "react";

// Typage des props dans le composant
type NavbarLogProps = {
  user: User; // Le prop 'user' doit être de type User
};

function NavbarLog({ user }: NavbarLogProps) {
  // Utiliser 'NavbarLogProps' ici
  return (
    <div>
      {user.avatarUrl}
      {user.avatarUrl && (
        <Image
          src={`/${user.avatarUrl}`}
          alt="avatar"
          width={50}
          height={50}
          className="rounded-full"
        />
      )}{" "}
    </div>
  ); // Afficher le prénom de l'utilisateur
}

export default NavbarLog;
