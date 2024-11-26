export async function fetchSSBData() {
  const url = "https://data.ssb.no/api/v0/dataset/1076.json?lang=no";
  const url2 = "https://data.ssb.no/api/v0/dataset/1102.json?lang=no";

  try {
    const [response1, response2] = await Promise.all([
      fetch(url),
      fetch(url2),
    ]);
    const data1 = await response1.json();
    const data2 = await response2.json();

    // Return both datasets for use in components
    return { data1, data2 };
  } catch (error) {
    console.error("Feil ved henting av data:", error);
    return null;
  }
}
