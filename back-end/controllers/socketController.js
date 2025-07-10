import { User } from "../models/users.js";

export function setupSocketHandlers(io) {
  // Suivre les utilisateurs connectés pour éviter les mises à jour de statut en double
  const connectedUsers = new Map();

  io.on("connection", (socket) => {
    console.log("✅ Socket connecté :", socket.id);

    socket.on("user_connected", async (userId) => {
      try {
        // Valider l'userId
        if (!userId) {
          console.error("❌ UserID manquant lors de la connexion");
          return;
        }

        socket.userId = userId;
        console.log("👤 Utilisateur connecté avec ID :", userId);

        // Vérifier si l'utilisateur est déjà suivi comme en ligne
        if (!connectedUsers.has(userId)) {
          await User.findByIdAndUpdate(userId, { isOnline: true });

          connectedUsers.set(userId, new Set([socket.id]));
          io.emit("update_online_status", { userId, isOnline: true });
          console.log("🟢 Statut en ligne mis à jour pour :", userId);
        } else {
          // L'utilisateur est déjà en ligne, ajouter simplement ce socket à son ensemble
          connectedUsers.get(userId).add(socket.id);
          console.log(
            "📱 Socket supplémentaire pour utilisateur déjà en ligne :",
            userId
          );
        }
      } catch (error) {
        console.error(
          "❌ Erreur lors de la mise à jour du statut en ligne :",
          error
        );
        socket.emit("connection_error", { message: "Erreur de connexion" });
      }
    });

    socket.on("disconnect", async () => {
      console.log("❌ Déconnexion :", socket.id);

      if (socket.userId) {
        try {
          const userId = socket.userId;

          if (connectedUsers.has(userId)) {
            const userSockets = connectedUsers.get(userId);
            userSockets.delete(socket.id);

            // Marquer l'utilisateur comme hors ligne seulement s'il n'y a plus de sockets
            if (userSockets.size === 0) {
              connectedUsers.delete(userId);

              console.log("🔄 Mise à jour isOnline=false pour :", userId);
              await User.findByIdAndUpdate(userId, { isOnline: false });

              io.emit("update_online_status", {
                userId: userId,
                isOnline: false,
              });
              console.log("🔴 Utilisateur marqué hors ligne :", userId);
            } else {
              console.log(
                "📱 Socket fermé mais utilisateur toujours connecté sur d'autres appareils :",
                userId
              );
            }
          }
        } catch (error) {
          console.error("❌ Erreur lors de la déconnexion :", error);
        }
      }
    });
  });
}
