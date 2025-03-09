
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMeetings } from "@/contexts/MeetingContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ParticipantBadge from "@/components/ParticipantBadge";
import { Calendar as CalendarIcon, Download } from "lucide-react";

const History: React.FC = () => {
  const { meetings } = useMeetings();
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const filteredMeetings = meetings.filter(meeting => {
    const meetingDate = parseISO(meeting.date);
    return (
      meetingDate.getFullYear() === selectedYear &&
      meetingDate.getMonth() + 1 === selectedMonth
    );
  });

  const years = Array.from(
    new Set(meetings.map(meeting => parseISO(meeting.date).getFullYear()))
  ).sort((a, b) => b - a);

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDENTE ASSINATURA":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "ATA PRELIMINAR":
        return "bg-blue-500 hover:bg-blue-600";
      case "ATA DEFINITIVA":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Histórico de Reuniões
          </CardTitle>
          <CardDescription>
            Visualize todas as reuniões passadas organizadas por mês e ano.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value.toString()}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredMeetings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Participantes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMeetings.map((meeting) => {
                  const meetingDate = parseISO(meeting.date);
                  return (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        {format(meetingDate, "dd 'de' MMMM", { locale: ptBR })}
                        <div className="text-sm text-muted-foreground">
                          {meeting.time}
                        </div>
                      </TableCell>
                      <TableCell>{meeting.title}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {meeting.participants
                            .slice(0, 3)
                            .map((participant) => (
                              <ParticipantBadge
                                key={participant.id}
                                name={participant.name}
                                avatar={participant.avatar}
                                size="sm"
                              />
                            ))}
                          {meeting.participants.length > 3 && (
                            <Badge variant="outline">
                              +{meeting.participants.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(meeting.status)}
                          variant="secondary"
                        >
                          {meeting.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              Nenhuma reunião encontrada para este período.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
};

export default History;
