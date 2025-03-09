
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Meeting types
export type MeetingStatus = 'PENDENTE ASSINATURA' | 'ATA PRELIMINAR' | 'ATA DEFINITIVA';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  status: MeetingStatus;
  platform?: string;
  videoLink?: string;
  participants: Participant[];
}

interface MeetingContextProps {
  meetings: Meeting[];
  filteredMeetings: Meeting[];
  setFilteredMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  updateMeeting: (id: string, data: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  getMeeting: (id: string) => Meeting | undefined;
  participants: Participant[];
}

const sampleParticipants: Participant[] = [
  {
    id: "1",
    name: "João Keuwe",
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
  },
  {
    id: "2",
    name: "Maria Silva",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "3",
    name: "João Oliveira",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "4",
    name: "Ana Santos",
    avatar: "https://randomuser.me/api/portraits/women/57.jpg",
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
];

const sampleMeetings: Meeting[] = [
  {
    id: '1',
    title: '[Reunião COMCAP e Pref. Florianópolis]',
    description: 'DISCUSSÃO DE REAJUSTE ANUAL DE TAXA DE COLETA',
    date: '2025-03-09',
    time: '17h',
    duration: '55min',
    status: 'PENDENTE ASSINATURA',
    platform: 'GOOGLE MEET',
    videoLink: 'https://meet.google.com/landing?hs=197&authuser=0',
    participants: [sampleParticipants[0], sampleParticipants[1], sampleParticipants[2], sampleParticipants[3]],
  },
  {
    id: '2',
    title: '[Reunião SINASTREM e Pref. Florianópolis]',
    description: 'DISCUSSÃO DE REAJUSTE ANUAL DE TAXA DE COLETA',
    date: '2025-03-09',
    time: '17h',
    duration: '45min',
    status: 'PENDENTE ASSINATURA',
    platform: 'ZOOM',
    participants: [sampleParticipants[0], sampleParticipants[4], sampleParticipants[2]],
  },
  {
    id: '3',
    title: '[Reunião COMCAP e Pref. Florianópolis]',
    description: 'DISCUSSÃO DE REAJUSTE ANUAL DE TAXA DE COLETA',
    date: '2025-03-09',
    time: '17h',
    duration: '60min',
    status: 'ATA PRELIMINAR',
    platform: 'MICROSOFT TEAMS',
    participants: [sampleParticipants[0], sampleParticipants[1], sampleParticipants[3]],
  },
  {
    id: '4',
    title: '[Reunião COMCAP e Pref. Florianópolis]',
    description: 'DISCUSSÃO DE REAJUSTE ANUAL DE TAXA DE COLETA',
    date: '2025-03-09',
    time: '17h',
    duration: '50min',
    status: 'ATA DEFINITIVA',
    platform: 'GOOGLE MEET',
    participants: [sampleParticipants[0], sampleParticipants[4]],
  },
  {
    id: '5',
    title: '[Reunião COMCAP e Pref. Florianópolis]',
    description: 'DISCUSSÃO DE REAJUSTE ANUAL DE TAXA DE COLETA',
    date: '2025-03-09',
    time: '17h',
    duration: '40min',
    status: 'PENDENTE ASSINATURA',
    platform: 'PRESENCIAL',
    participants: [sampleParticipants[0], sampleParticipants[2], sampleParticipants[3], sampleParticipants[4]],
  },
];

const MeetingContext = createContext<MeetingContextProps>({
  meetings: [],
  filteredMeetings: [],
  setFilteredMeetings: () => {},
  addMeeting: () => {},
  updateMeeting: () => {},
  deleteMeeting: () => {},
  getMeeting: () => undefined,
  participants: [],
});

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    const storedMeetings = localStorage.getItem('meetings');
    return storedMeetings ? JSON.parse(storedMeetings) : sampleMeetings;
  });
  
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>(meetings);
  
  const [participants] = useState<Participant[]>(sampleParticipants);

  useEffect(() => {
    localStorage.setItem('meetings', JSON.stringify(meetings));
    setFilteredMeetings(meetings);
  }, [meetings]);

  const addMeeting = (meeting: Omit<Meeting, 'id'>) => {
    const newMeeting = {
      ...meeting,
      id: Date.now().toString(),
    };
    
    setMeetings(prevMeetings => [...prevMeetings, newMeeting]);
    toast.success('Reunião criada com sucesso!');
  };

  const updateMeeting = (id: string, data: Partial<Meeting>) => {
    setMeetings(prevMeetings => 
      prevMeetings.map(meeting => 
        meeting.id === id ? { ...meeting, ...data } : meeting
      )
    );
    toast.success('Reunião atualizada com sucesso!');
  };

  const deleteMeeting = (id: string) => {
    setMeetings(prevMeetings => prevMeetings.filter(meeting => meeting.id !== id));
    toast.success('Reunião excluída com sucesso!');
  };

  const getMeeting = (id: string) => {
    return meetings.find(meeting => meeting.id === id);
  };

  return (
    <MeetingContext.Provider 
      value={{ 
        meetings, 
        filteredMeetings,
        setFilteredMeetings,
        addMeeting, 
        updateMeeting, 
        deleteMeeting, 
        getMeeting,
        participants,
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeetings = () => useContext(MeetingContext);
