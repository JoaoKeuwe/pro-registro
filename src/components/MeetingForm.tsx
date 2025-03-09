
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Meeting, 
  MeetingStatus, 
  Participant, 
  useMeetings 
} from "@/contexts/MeetingContext";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import ParticipantBadge from "./ParticipantBadge";

interface MeetingFormProps {
  meeting?: Meeting;
  isOpen: boolean;
  onClose: () => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({
  meeting,
  isOpen,
  onClose,
}) => {
  const { addMeeting, updateMeeting, participants } = useMeetings();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState<MeetingStatus>("PENDENTE ASSINATURA");
  const [platform, setPlatform] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);
  const [availableParticipants, setAvailableParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title);
      setDescription(meeting.description);
      setDate(new Date(meeting.date));
      setTime(meeting.time);
      setDuration(meeting.duration);
      setStatus(meeting.status);
      setPlatform(meeting.platform || "");
      setVideoLink(meeting.videoLink || "");
      setSelectedParticipants(meeting.participants);
      
      // Set available participants (those not already selected)
      const selected = new Set(meeting.participants.map(p => p.id));
      setAvailableParticipants(participants.filter(p => !selected.has(p.id)));
    } else {
      // Reset form for new meeting
      setTitle("");
      setDescription("");
      setDate(undefined);
      setTime("");
      setDuration("");
      setStatus("PENDENTE ASSINATURA");
      setPlatform("");
      setVideoLink("");
      setSelectedParticipants([]);
      setAvailableParticipants(participants);
    }
  }, [meeting, participants, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !date || !time) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    const formattedDate = date.toISOString().split("T")[0];
    
    if (meeting) {
      updateMeeting(meeting.id, {
        title,
        description,
        date: formattedDate,
        time,
        duration,
        status,
        platform,
        videoLink,
        participants: selectedParticipants,
      });
      
      navigate(`/meetings/${meeting.id}`);
    } else {
      const newMeeting = {
        title,
        description,
        date: formattedDate,
        time,
        duration,
        status,
        platform,
        videoLink,
        participants: selectedParticipants,
      };
      
      addMeeting(newMeeting);
    }
    
    onClose();
  };

  const addParticipant = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      setSelectedParticipants(prev => [...prev, participant]);
      setAvailableParticipants(prev => prev.filter(p => p.id !== participantId));
    }
  };

  const removeParticipant = (participantId: string) => {
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      setSelectedParticipants(prev => prev.filter(p => p.id !== participantId));
      setAvailableParticipants(prev => [...prev, participant]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {meeting ? "Editar Reunião" : "Nova Reunião"}
          </DialogTitle>
          <DialogDescription>
            {meeting
              ? "Edite os detalhes da reunião abaixo."
              : "Preencha os detalhes da nova reunião."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da reunião"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Pauta</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a pauta da reunião"
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        date.toLocaleDateString("pt-BR")
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Hora</Label>
                <Input
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Ex: 14h30"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duração</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex: 60min"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as MeetingStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE ASSINATURA">
                      PENDENTE ASSINATURA
                    </SelectItem>
                    <SelectItem value="ATA PRELIMINAR">ATA PRELIMINAR</SelectItem>
                    <SelectItem value="ATA DEFINITIVA">ATA DEFINITIVA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Plataforma</Label>
                <Input
                  id="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="Ex: Google Meet, Zoom, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoLink">Link da Videochamada</Label>
                <Input
                  id="videoLink"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Participantes</Label>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedParticipants.map((participant) => (
                  <div 
                    key={participant.id}
                    className="flex items-center gap-2 bg-secondary p-1 pl-1 pr-3 rounded-full"
                  >
                    <ParticipantBadge
                      name={participant.name}
                      avatar={participant.avatar}
                      size="sm"
                      className="ring-0"
                    />
                    <span className="text-sm">{participant.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 rounded-full"
                      onClick={() => removeParticipant(participant.id)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              
              {availableParticipants.length > 0 && (
                <Select
                  onValueChange={(value) => {
                    addParticipant(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Adicionar participantes" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableParticipants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.id}>
                        <div className="flex items-center gap-2">
                          <img
                            src={participant.avatar}
                            alt={participant.name}
                            className="w-6 h-6 rounded-full"
                          />
                          {participant.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {meeting ? "Salvar Alterações" : "Criar Reunião"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingForm;
