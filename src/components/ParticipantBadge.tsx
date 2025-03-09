
import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ParticipantBadgeProps {
  name: string;
  avatar: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ParticipantBadge: React.FC<ParticipantBadgeProps> = ({
  name,
  avatar,
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className={cn(sizeClasses[size], "ring-2 ring-background", className)}>
            <AvatarImage src={avatar} alt={name} className="object-cover" />
            <AvatarFallback className="text-xs">{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ParticipantBadge;
