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

//Fetch a single property by ID from the API
async function fetchContract(id: string): Promise<ContractType | null> {
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

  try {
    // Handle case where API domain is not defined
    if (!apiDomain) {
      return null;
    }

    const res = await fetch(`${apiDomain}/contracts/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return null;
  }
}

export { fetchContracts, fetchContract };
