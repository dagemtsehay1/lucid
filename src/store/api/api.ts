export const fetchRecords = async () => {
  const BASE_URL = "https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete";
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch records");
  }
  return res.json();
};
