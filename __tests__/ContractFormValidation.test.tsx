import { render, screen, fireEvent } from "@testing-library/react";
import ContractAddForm from "@/components/ContractAddForm";

describe("ContractAddForm", () => {
  test("No debe permitir el envío si el nombre del contrato está vacío", () => {
    render(<ContractAddForm />);

    const nameInput = screen.getByLabelText(/contract name/i);
    const submitButton = screen.getByRole("button", {
      name: /save contract/i,
    });

    fireEvent.change(nameInput, { target: { value: "" } });

    expect(submitButton).toBeDisabled();
  });

  test("Debe habilitar el botón cuando el nombre tiene contenido", () => {
    render(<ContractAddForm />);

    const nameInput = screen.getByLabelText(/contract name/i);
    const submitButton = screen.getByRole("button", {
      name: /save contract/i,
    });

    fireEvent.change(nameInput, {
      target: { value: "Contrato de Alquiler 2026" },
    });

    expect(submitButton).not.toBeDisabled();
  });
});
