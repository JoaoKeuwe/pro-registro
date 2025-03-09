
import React, { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useMeetings } from "@/contexts/MeetingContext";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Calendar: React.FC = () => {
  const { meetings } = useMeetings();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const getDayMeetings = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return meetings.filter(meeting => meeting.date === formattedDate);
  };
  
  const selectedDateMeetings = selectedDate ? getDayMeetings(selectedDate) : [];
  
  const hasMeetings = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return meetings.some(meeting => meeting.date === formattedDate);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Calendário de Reuniões</h1>
        <p className="text-muted-foreground">
          Visualize suas reuniões por data
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-8">
        <div className="glassmorphism rounded-lg p-4">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="pointer-events-auto"
            modifiers={{
              hasMeeting: (date) => hasMeetings(date),
            }}
            modifiersClassNames={{
              hasMeeting: "bg-primary/20 font-medium text-primary",
            }}
          />
        </div>
        
        <div>
          <h2 className="text-xl font-medium mb-4">
            {selectedDate ? (
              <span>
                Reuniões em{" "}
                {selectedDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            ) : (
              "Selecione uma data"
            )}
          </h2>
          
          {selectedDateMeetings.length === 0 ? (
            <div className="text-muted-foreground py-12 text-center">
              <p>Nenhuma reunião agendada para esta data.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateMeetings.map(meeting => (
                <Card 
                  key={meeting.id} 
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/meetings/${meeting.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{meeting.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{meeting.time} - {meeting.duration}</p>
                    </div>
                    
                    <Badge variant="outline" className={cn(
                      meeting.status === "PENDENTE ASSINATURA" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                      meeting.status === "ATA PRELIMINAR" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                      meeting.status === "ATA DEFINITIVA" && "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    )}>
                      {meeting.status}
                    </Badge>
                  </div>
                  
                  <p className="mt-2">{meeting.description}</p>
                  
                  {meeting.platform && (
                    <p className="mt-1 text-sm">
                      <span className="font-medium">Plataforma:</span> {meeting.platform}
                    </p>
                  )}
                  
                  <div className="mt-4 flex -space-x-2">
                    {meeting.participants.slice(0, 5).map(participant => (
                      <div 
                        key={participant.id} 
                        className="h-8 w-8 rounded-full border-2 border-background overflow-hidden"
                      >
                        <img 
                          src={participant.avatar} 
                          alt={participant.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    
                    {meeting.participants.length > 5 && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        +{meeting.participants.length - 5}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
