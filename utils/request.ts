import { ContractType } from "@/models/Contract";

//Fetch all properties from the API
async function fetchContracts({ showFeatured = false } = {}): Promise<
  ContractType[]
> {
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

  try {
    // Handle case where API domain is not defined
    if (!apiDomain) {
      return [];
    }

    const res = await fetch(
      `${apiDomain}/contracts${showFeatured ? "/featured" : ""}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return [];
  }
}

//Fetch a single contract by ID from the API
async function fetchContract(id: string): Promise<ContractType | null> {
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

  // Validación extra: si el ID no es válido o es "undefined", ni lo intentamos
  if (!id || id === "undefined") return null;

  try {
    if (!apiDomain) return null;

    const res = await fetch(`${apiDomain}/contracts/${id}`, {
      cache: "no-store", // Evitamos que el servidor guarde datos viejos
    });

    // En lugar de un throw que rompe todo, manejamos el status
    if (res.status === 404) return null;

    if (!res.ok) {
      // Logueamos el error pero no matamos la ejecución
      console.error(`Server error: ${res.status} al buscar contrato ${id}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching contract:", error);
    return null;
  }
}

async function searchContracts(params: Record<string, string>) {
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${apiDomain}/contracts/search?${query}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return await res.json();
}

async function deleteContract(id: string): Promise<boolean> {
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;
  try {
    if (!apiDomain) return false;

    const res = await fetch(`${apiDomain}/contracts/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete contract");
    }

    return true; // Si todo salió bien, devolvemos true
  } catch (error) {
    console.error("Error deleting contract:", error);
    return false;
  }
}

async function fetchStudioMembers(studioId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_DOMAIN}/studio/${studioId}/members`,
    );
    if (!res.ok) throw new Error("Failed to fetch members");
    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export {
  fetchContracts,
  deleteContract,
  fetchContract,
  fetchStudioMembers,
  searchContracts,
};
