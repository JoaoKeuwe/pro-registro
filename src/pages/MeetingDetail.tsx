
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMeetings } from "@/contexts/MeetingContext";
import { ArrowLeft, Edit, Trash, Download, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ParticipantBadge from "@/components/ParticipantBadge";
import MeetingForm from "@/components/MeetingForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const MeetingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMeeting, deleteMeeting } = useMeetings();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const meeting = getMeeting(id || "");
  
  if (!meeting) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h1 className="text-2xl font-bold mb-4">Reunião não encontrada</h1>
        <Button onClick={() => navigate("/")}>Voltar para Home</Button>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteMeeting(meeting.id);
    navigate("/");
  };
  
  const getStatusColor = () => {
    switch (meeting.status) {
      case "PENDENTE ASSINATURA":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "ATA PRELIMINAR":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "ATA DEFINITIVA":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "";
    }
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 slide-in">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 flex items-center gap-2" 
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold">{meeting.title}</h1>
            <Badge variant="outline" className={`mt-2 ${getStatusColor()}`}>
              {meeting.status}
            </Badge>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Assinatura
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" className="flex items-center gap-2 text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash className="h-4 w-4" />
              Deletar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border shadow-sm p-6 fade-in">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <Badge variant="outline" className={getStatusColor()}>
              {meeting.status}
            </Badge>
          </div>
          
          {meeting.platform && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Plataforma</p>
              <p className="font-medium">{meeting.platform}</p>
            </div>
          )}
          
          {meeting.videoLink && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Videochamada</p>
              <a 
                href={meeting.videoLink} 
                target="_blank" 
                rel="noreferrer"
                className="text-primary flex items-center gap-1 hover:underline"
              >
                Link de acesso <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Data</p>
            <p className="font-medium">
              {new Date(meeting.date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">Duração</p>
            <p className="font-medium">{meeting.duration}</p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Pauta</p>
          <p className="text-xl font-medium">{meeting.description}</p>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <p className="text-sm text-muted-foreground mb-4">Participantes</p>
          <div className="flex flex-wrap gap-4">
            {meeting.participants.map((participant) => (
              <div key={participant.id} className="flex flex-col items-center">
                <ParticipantBadge 
                  name={participant.name}
                  avatar={participant.avatar}
                  size="lg"
                />
                <span className="mt-2 text-sm">{participant.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <MeetingForm 
        meeting={meeting}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente esta reunião.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MeetingDetail;
