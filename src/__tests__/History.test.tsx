import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useMeetings } from "@/contexts/MeetingContext";
import History from "../pages/History";

jest.mock("@/contexts/MeetingContext", () => ({
  useMeetings: jest.fn(),
}));

describe("History Component", () => {
  const mockMeetings = [
    {
      id: "1",
      title: "Reunião de Teste 1",
      date: "2025-02-15T10:00:00.000Z",
      time: "10:00 AM",
      participants: [
        { id: "1", name: "João", avatar: "avatar1.png" },
        { id: "2", name: "Maria", avatar: "avatar2.png" },
      ],
      status: "PENDENTE ASSINATURA",
    },
    {
      id: "2",
      title: "Reunião de Teste 2",
      date: "2025-03-20T15:00:00.000Z",
      time: "03:00 PM",
      participants: [{ id: "3", name: "Carlos", avatar: "avatar3.png" }],
      status: "ATA DEFINITIVA",
    },
  ];

  beforeEach(() => {
    (useMeetings as jest.Mock).mockReturnValue({ meetings: mockMeetings });
  });

  test("should render title and description correctly", () => {
    render(<History />);
    
    expect(screen.getByText(/Histórico de Reuniões/i)).toBeInTheDocument();
    expect(screen.getByText(/Visualize todas as reuniões passadas organizadas por mês e ano./i)).toBeInTheDocument();
  });

  test("should load and display available years and months", () => {
    render(<History />);
    
    expect(screen.getByPlaceholderText(/Ano/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mês/i)).toBeInTheDocument();
    
    fireEvent.click(screen.getByPlaceholderText(/Ano/i));
    fireEvent.click(screen.getByText(/2025/i));
    
    fireEvent.click(screen.getByPlaceholderText(/Mês/i));
    fireEvent.click(screen.getByText(/Março/i));

    expect(screen.getByText(/2025/i)).toBeInTheDocument();
    expect(screen.getByText(/Março/i)).toBeInTheDocument();
  });

  test("should display filtered meetings in the table", () => {
    render(<History />);
    
    fireEvent.click(screen.getByPlaceholderText(/Mês/i));
    fireEvent.click(screen.getByText(/Março/i));
    
    expect(screen.getByText(/Reunião de Teste 2/i)).toBeInTheDocument();
    expect(screen.queryByText(/Reunião de Teste 1/i)).not.toBeInTheDocument();
  });

  test("should show 'No meetings found' message when no meetings match the selected period", () => {
    render(<History />);
    
    fireEvent.click(screen.getByPlaceholderText(/Ano/i));
    fireEvent.click(screen.getByText(/2025/i));
    
    fireEvent.click(screen.getByPlaceholderText(/Mês/i));
    fireEvent.click(screen.getByText(/Abril/i));

    expect(screen.getByText(/Nenhuma reunião encontrada para este período./i)).toBeInTheDocument();
  });

  test("should show the correct status badge colors", () => {
    render(<History />);
    
    const pendingBadge = screen.getByText(/PENDENTE ASSINATURA/i).closest('div');
    expect(pendingBadge).toHaveClass("bg-yellow-500");
    
    const finalBadge = screen.getByText(/ATA DEFINITIVA/i).closest('div');
    expect(finalBadge).toHaveClass("bg-green-500");
  });
});

