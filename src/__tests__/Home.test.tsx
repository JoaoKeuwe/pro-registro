import { render, screen } from "@testing-library/react";
import { useMeetings } from "@/contexts/MeetingContext";
import { useUser } from "@/contexts/UserContext";
import Home from "../pages/Home";
import "@testing-library/jest-dom";

jest.mock("@/contexts/MeetingContext", () => ({
  useMeetings: jest.fn(),
}));

jest.mock("@/contexts/UserContext", () => ({
  useUser: jest.fn(),
}));

describe("Home Component", () => {
  it("should not render anything if user is not logged in", () => {
    (useUser as jest.Mock).mockReturnValue({ user: null });

    const { container } = render(<Home />);

    expect(container.firstChild).toBeNull();
  });

  it("should display a message when there are no meetings", () => {
    (useUser as jest.Mock).mockReturnValue({ user: { name: "Test User" } });
    (useMeetings as jest.Mock).mockReturnValue({ filteredMeetings: [] });

    render(<Home />);

    expect(screen.getByText("Nenhuma reunião encontrada")).toBeInTheDocument();
    expect(
      screen.getByText("Tente ajustar os filtros ou crie uma nova reunião.")
    ).toBeInTheDocument();
  });

  it("should render the list of meetings when meetings exist", () => {
    (useUser as jest.Mock).mockReturnValue({ user: { name: "Test User" } });
    (useMeetings as jest.Mock).mockReturnValue({
      filteredMeetings: [
        { id: "1", title: "Reunião de Equipe" },
        { id: "2", title: "Planejamento de Projeto" },
      ],
    });

    render(<Home />);

    expect(screen.getByText("Reunião de Equipe")).toBeInTheDocument();
    expect(screen.getByText("Planejamento de Projeto")).toBeInTheDocument();
  });

  it("should display the correct header and subheader", () => {
    (useUser as jest.Mock).mockReturnValue({ user: { name: "Test User" } });
    (useMeetings as jest.Mock).mockReturnValue({ filteredMeetings: [] });

    render(<Home />);

    expect(
      screen.getByRole("heading", { name: /Registro de Reuniões/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Gerencie suas reuniões e atas")
    ).toBeInTheDocument();
  });

  it("should render the FilterBar with the correct result count", () => {
    (useUser as jest.Mock).mockReturnValue({ user: { name: "Test User" } });
    (useMeetings as jest.Mock).mockReturnValue({
      filteredMeetings: [{ id: "1", title: "Reunião de Equipe" }],
    });

    render(<Home />);

    expect(screen.getByText("1 resultado")).toBeInTheDocument();
  });
});
