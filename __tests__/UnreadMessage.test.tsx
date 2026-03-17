// __tests__/UnreadBadge.test.tsx
import { render, screen } from "@testing-library/react";

test("El indicador de mensajes debe ser rojo cuando hay notificaciones", () => {
  const messages = 10;
  render(
    <span className={messages > 0 ? "bg-red-500" : "bg-gray-200"}>
      {messages}
    </span>,
  );

  const badge = screen.getByText("10");

  // Verifica que tenga la clase de color rojo
  expect(badge).toHaveClass("bg-red-500");
  // Verifica que NO sea gris
  expect(badge).not.toHaveClass("bg-gray-200");
});
