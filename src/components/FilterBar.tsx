
import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import {  MeetingStatus,  useMeetings } from "@/contexts/MeetingContext";

interface FilterBarProps {
  className?: string;
  resultCount: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ className, resultCount }) => {
  const { meetings, setFilteredMeetings, participants } = useMeetings();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<MeetingStatus[]>([]);
  const [participantFilter, setParticipantFilter] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  useEffect(() => {
    let filtered = meetings;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        meeting => 
          meeting.title.toLowerCase().includes(term) || 
          meeting.description.toLowerCase().includes(term)
      );
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter(meeting => 
        statusFilter.includes(meeting.status)
      );
    }

    if (participantFilter.length > 0) {
      filtered = filtered.filter(meeting => 
        meeting.participants.some(participant => 
          participantFilter.includes(participant.id)
        )
      );
    }

    if (dateFilter) {
      const filterDate = dateFilter.toISOString().split('T')[0];
      filtered = filtered.filter(meeting => meeting.date === filterDate);
    }

    setFilteredMeetings(filtered);
  }, [searchTerm, statusFilter, participantFilter, dateFilter, meetings, setFilteredMeetings]);

  const toggleStatusFilter = (status: MeetingStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const toggleParticipantFilter = (id: string) => {
    setParticipantFilter(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id]
    );
  };
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter([]);
    setParticipantFilter([]);
    setDateFilter(undefined);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {/* Status Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                STATUS
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4">
              <div className="space-y-3">
                <h4 className="font-medium">Status da Ata</h4>
                <div className="space-y-2">
                  {['PENDENTE ASSINATURA', 'ATA PRELIMINAR', 'ATA DEFINITIVA'].map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <Checkbox 
                        id={`status-${status}`} 
                        checked={statusFilter.includes(status as MeetingStatus)}
                        onCheckedChange={() => toggleStatusFilter(status as MeetingStatus)}
                      />
                      <Label htmlFor={`status-${status}`}>{status}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                PARTICIPANTES
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4">
              <div className="space-y-3">
                <h4 className="font-medium">Participantes</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-2">
                      <Checkbox 
                        id={`participant-${participant.id}`} 
                        checked={participantFilter.includes(participant.id)}
                        onCheckedChange={() => toggleParticipantFilter(participant.id)}
                      />
                      <Label htmlFor={`participant-${participant.id}`} className="flex items-center gap-2">
                        <img 
                          src={participant.avatar} 
                          alt={participant.name} 
                          className="w-6 h-6 rounded-full"
                        />
                        {participant.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                DATA
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFilter}
                onSelect={setDateFilter}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {(searchTerm || statusFilter.length > 0 || participantFilter.length > 0 || dateFilter) && (
            <Button variant="ghost" onClick={clearFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {statusFilter.map(status => (
          <Badge 
            key={status} 
            variant="secondary"
            className="px-3 py-1 rounded-full cursor-pointer"
            onClick={() => toggleStatusFilter(status)}
          >
            {status} ×
          </Badge>
        ))}
        
        {participantFilter.map(id => {
          const participant = participants.find(p => p.id === id);
          return participant ? (
            <Badge 
              key={id} 
              variant="secondary"
              className="px-3 py-1 rounded-full cursor-pointer"
              onClick={() => toggleParticipantFilter(id)}
            >
              {participant.name} ×
            </Badge>
          ) : null;
        })}
        
        {dateFilter && (
          <Badge 
            variant="secondary"
            className="px-3 py-1 rounded-full cursor-pointer"
            onClick={() => setDateFilter(undefined)}
          >
            {dateFilter.toLocaleDateString('pt-BR')} ×
          </Badge>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground">
        {resultCount} resultados encontrados
      </div>
    </div>
  );
};

export default FilterBar;
