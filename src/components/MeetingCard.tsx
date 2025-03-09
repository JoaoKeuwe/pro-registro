
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Meeting, MeetingStatus } from "@/contexts/MeetingContext";
import { Badge } from "@/components/ui/badge";
import ParticipantBadge from "@/components/ParticipantBadge";
import { Card, CardContent } from "@/components/ui/card";

interface MeetingCardProps {
  meeting: Meeting;
  className?: string;
}

const StatusBadge: React.FC<{ status: MeetingStatus }> = ({ status }) => {
  const statusConfig = {
    "PENDENTE ASSINATURA": { 
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400", 
      label: "PENDENTE ASSINATURA"
    },
    "ATA PRELIMINAR": { 
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", 
      label: "ATA PRELIMINAR" 
    },
    "ATA DEFINITIVA": { 
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", 
      label: "ATA DEFINITIVA" 
    },
  };

  const { color, label } = statusConfig[status];

  return (
    <Badge variant="outline" className={cn("font-medium text-xs", color)}>
      {label}
    </Badge>
  );
};

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, className }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const handleClick = () => {
    navigate(`/meetings/${meeting.id}`);
  };
  
  return (
    <Card 
      className={cn(
        "w-full overflow-hidden transition-all cursor-pointer hover:shadow-md scale-in",
        theme === 'dark' ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50',
        className
      )}
      onClick={handleClick}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
            <h3 className="text-lg font-medium text-left">{meeting.title}</h3>
          </div>
          
          <StatusBadge status={meeting.status} />
        </div>
        
        <div className="mt-4 text-muted-foreground text-left">
          <p className="uppercase text-sm font-medium">{meeting.description}</p>
          <p className="mt-1 text-sm">
            {new Date(meeting.date).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric' 
            })} | {meeting.time}
          </p>
        </div>
        
        <div className="mt-4 flex -space-x-2">
          {meeting.participants.slice(0, 4).map((participant) => (
            <ParticipantBadge
              key={participant.id}
              name={participant.name}
              avatar={participant.avatar}
              size="sm"
            />
          ))}
          
          {meeting.participants.length > 4 && (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              +{meeting.participants.length - 4}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
