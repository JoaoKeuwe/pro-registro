
import React, { useState } from "react";
import { useMeetings } from "@/contexts/MeetingContext";
import { useUser } from "@/contexts/UserContext";
import FilterBar from "@/components/FilterBar";
import MeetingCard from "@/components/MeetingCard";
import CreateMeetingButton from "@/components/CreateMeetingButton";

const Home: React.FC = () => {
  const { filteredMeetings } = useMeetings();
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 fade-in">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Registro de Reuniões</h1>
          <p className="text-muted-foreground">
            Gerencie suas reuniões e atas
          </p>
        </div>
        <CreateMeetingButton />
      </div>

      <FilterBar resultCount={filteredMeetings.length} />
      
      <div className="mt-8 grid grid-cols-1 gap-4">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Nenhuma reunião encontrada</h3>
            <p className="text-muted-foreground mt-1">
              Tente ajustar os filtros ou crie uma nova reunião.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
