
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MeetingForm from "./MeetingForm";

interface CreateMeetingButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const CreateMeetingButton: React.FC<CreateMeetingButtonProps> = ({
  variant = "default",
  size = "default",
  className,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn("flex items-center gap-2", className)}
        onClick={() => setIsFormOpen(true)}
      >
        <Plus className="h-5 w-5" />
        {size !== "icon" && <span>Nova Reunião</span>}
      </Button>

      <MeetingForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </>
  );
};

export default CreateMeetingButton;
