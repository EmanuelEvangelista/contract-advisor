// Esta es la lógica que vive en tu useEffect o funciones de utilidad
const calculateContractTotal = (area: number, qha: number) => {
  const result = area * qha;
  return isNaN(result) ? 0 : result;
};

test("Debe calcular el total de quintales correctamente", () => {
  expect(calculateContractTotal(100, 2)).toBe(200); // 100ha * 2qha
  expect(calculateContractTotal(0, 50)).toBe(0); // Caso borde: area 0
});

test("Debe manejar valores nulos sin romper la app", () => {
  expect(calculateContractTotal(undefined as any, 5)).toBe(0);
});
