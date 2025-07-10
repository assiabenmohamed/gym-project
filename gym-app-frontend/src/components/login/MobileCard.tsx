import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Edit } from "lucide-react";
import { AiOutlineUserDelete } from "react-icons/ai";
interface Member {
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
interface MobileMemberCardProps {
  user: Member;
  getSubscriptionExpiration: (id: string) => Date | null;
  getTrainerName: (id: string) => string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function MobileMemberCard({
  user,
  getSubscriptionExpiration,
  getTrainerName,
  onEdit,
  onDelete,
}: MobileMemberCardProps) {
  const expiration = getSubscriptionExpiration(user._id);
  const isExpired = expiration ? expiration < new Date() : false;

  return (
    <div className="p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="relative">
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="font-medium text-gray-600 text-sm">
                {user.lastName.charAt(0)}
                {user.firstName.charAt(0)}
              </span>
            </div>
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                user.isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm">
              {user.lastName} {user.firstName}
            </div>
            <div className="text-sm text-gray-500 truncate mt-1">
              {user.email}
            </div>
            <div className="text-sm text-gray-500 mt-1">{user.phoneNumber}</div>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  user.gender === "male"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-pink-100 text-pink-800"
                }`}
              >
                {user.gender}
              </span>
              {expiration ? (
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    isExpired
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {expiration.toLocaleDateString("fr-FR")}
                </span>
              ) : (
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  No subscription
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Trainer:{" "}
              {user.trainerAssigned
                ? getTrainerName(user.trainerAssigned)
                : "No trainer assigned"}
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={onEdit}
              className="hover:bg-transparent focus:bg-transparent active:bg-transparent text-black w-full"
            >
              <span className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md w-full">
                <Edit className="h-4 w-4" /> Edit
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={onDelete}
              className="hover:bg-transparent focus:bg-transparent active:bg-transparent text-black w-full"
            >
              <span className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
                <AiOutlineUserDelete className="h-4 w-4" /> Delete
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
