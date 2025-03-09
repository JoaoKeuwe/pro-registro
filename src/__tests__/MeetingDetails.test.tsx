import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import  MeetingContext  from "../contexts/MeetingContext";
import MeetingDetail from "./MeetingDetail";
import { useNavigate, useParams } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

describe("MeetingDetail Component", () => {
  const mockNavigate = jest.fn();
  const mockGetMeeting = jest.fn();
  const mockDeleteMeeting = jest.fn();

  beforeAll(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ id: "1" });
  });

  const renderWithContext = () => {
    return render(
      <MeetingContext.Provider
        value={{
          meetings: [],
          filteredMeetings: [],
          setFilteredMeetings: jest.fn(),
          getMeeting: mockGetMeeting,
          addMeeting: jest.fn(),
          deleteMeeting: mockDeleteMeeting,
          updateMeeting: jest.fn()
        }}
      >
        <BrowserRouter>
          <MeetingDetail />
        </BrowserRouter>
      </MeetingContext.Provider>
    );
  };

  it("should display 'Reunião não encontrada' if meeting is not found", () => {
    mockGetMeeting.mockReturnValue(undefined);

    renderWithContext(null);

    expect(screen.getByText("Reunião não encontrada")).toBeInTheDocument();
    expect(screen.getByText("Voltar para Home")).toBeInTheDocument();
  });

  it("should display meeting details when meeting exists", () => {
    const mockMeeting = {
      id: "1",
      title: "Reunião de Teste",
      status: "PENDENTE ASSINATURA",
      platform: "Zoom",
      videoLink: "https://example.com",
      date: new Date().toISOString(),
      duration: "1h",
      description: "Discussão sobre o projeto X",
      participants: [
        { id: "p1", name: "João Silva", avatar: "avatar1.png" },
        { id: "p2", name: "Maria Oliveira", avatar: "avatar2.png" },
      ],
    };

    mockGetMeeting.mockReturnValue(mockMeeting);

    renderWithContext(mockMeeting);

    expect(screen.getByText("Reunião de Teste")).toBeInTheDocument();
    expect(screen.getByText("Discussão sobre o projeto X")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Maria Oliveira")).toBeInTheDocument();
    expect(screen.getByText("Exportar PDF")).toBeInTheDocument();
    expect(screen.getByText("Deletar")).toBeInTheDocument();
  });

  it("should call deleteMeeting and navigate when deleting a meeting", () => {
    const mockMeeting = {
      id: "1",
      title: "Reunião de Teste",
      status: "ATA PRELIMINAR",
      participants: [],
    };

    mockGetMeeting.mockReturnValue(mockMeeting);

    renderWithContext(mockMeeting);

    const deleteButton = screen.getByText("Deletar");
    fireEvent.click(deleteButton);

    // Simula o modal de confirmação de exclusão
    const confirmDeleteButton = screen.getByText("Excluir");
    fireEvent.click(confirmDeleteButton);

    expect(mockDeleteMeeting).toHaveBeenCalledWith("1");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
