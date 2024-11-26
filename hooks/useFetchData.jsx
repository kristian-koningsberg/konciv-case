import { useState, useEffect } from "react";
import { fetchSSBData } from "@/lib/fetchSSBData";

export const useFetchData = () => {
  const [ssbData, setSsbData] = useState({
    data1: null,
    data2: null,
  });

  useEffect(() => {
    async function getData() {
      const data = await fetchSSBData();
      setSsbData(data);
    }
    getData();
  }, []);

  return ssbData;
};
