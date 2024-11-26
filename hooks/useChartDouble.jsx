import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
  reshapeValues,
  filterData,
  generateColor,
} from "@/utils/utils";

export const useChartDouble = (
  ssbData,
  region1Filter,
  region2Filter,
  ageFilter,
  yearFilter,
  ageRanges,
  type = "line"
) => {
  const chartRef = useRef(null); // Reference to the chart DOM element
  const myChartRef = useRef(null); // Reference to the Chart.js instance

  useEffect(() => {
    if (!chartRef.current || !ssbData) return; // Early return if chartRef or ssbData is not available

    // Extract data from ssbData
    const regions = ssbData.dataset.dimension.Region.category.label;
    const ages = ssbData.dataset.dimension.Alder.category.label;
    const years = ssbData.dataset.dimension.Tid.category.label;
    const values = ssbData.dataset.value;

    // Extract indices for regions, ages, and years
    const regionIndices =
      ssbData.dataset.dimension.Region.category.index;
    const ageIndices = ssbData.dataset.dimension.Alder.category.index;
    const yearIndices = ssbData.dataset.dimension.Tid.category.index;

    // Reshape the raw data into a more usable format
    const reshapedValues = reshapeValues(
      values,
      regionIndices,
      ageIndices,
      yearIndices,
      ages,
      years,
      ageRanges
    );

    // Format the data for charting
    const formattedData = Object.keys(regions).map((regionKey) => ({
      region: regions[regionKey],
      ages: ageRanges.map((range) => ({
        age: range.label,
        populations: Object.keys(years).map((yearKey) => ({
          year: years[yearKey],
          population:
            reshapedValues[regionKey][range.label][yearKey] || 0,
        })),
      })),
    }));

    // Apply filters to the formatted data
    let filteredData1 = filterData(
      formattedData,
      region1Filter,
      ageFilter,
      yearFilter
    );

    let filteredData2 = filterData(
      formattedData,
      region2Filter,
      ageFilter,
      yearFilter
    );

    // Ensure data spans across all years
    const getDataForRegion = (filteredData) => {
      const data = ageRanges.map((range) => {
        const ageData = filteredData.flatMap((item) =>
          item.ages.filter((ageItem) => ageItem.age === range.label)
        );
        return ageData.length
          ? ageData[0].populations.reduce(
              (acc, pop) => acc + pop.population,
              0
            )
          : 0;
      });
      return data;
    };

    const data1 = getDataForRegion(filteredData1);
    const data2 = getDataForRegion(filteredData2);

    // Prepare chart data for Chart.js
    const chartData = {
      labels: ageRanges.map((range) => range.label),
      datasets: [
        {
          label: `${region1Filter}`,
          data: data1,
          backgroundColor: "#16a34acc",
          borderColor: "#16a34a",
          borderWidth: 1,
          fill: false,
        },
        {
          label: `${region2Filter}`,
          data: data2,
          backgroundColor: "#ea580ccc",
          borderColor: "#ea580c",
          borderWidth: 1,
          fill: false,
        },
      ],
    };

    // Destroy the previous chart instance if it exists
    if (myChartRef.current) {
      myChartRef.current.destroy();
    }

    // Get the context of the chart canvas
    const ctx = chartRef.current.getContext("2d");

    // Create a new Chart.js instance
    myChartRef.current = new Chart(ctx, {
      type: type || "line",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
            position: "bottom",
          },
          title: {
            display: true,
            text: "Sammenligning av befolkning (x = alder, y = befolkning)",
          },
        },
        scales: {
          x: {
            title: {
              display: false,
              text: "Alder",
              stepSize: 1,
            },
            beginAtZero: true,
          },
          y: {
            title: {
              display: false,
              text: "Befolkning",
              stepSize: 1,
            },
            beginAtZero: true,
          },
        },
      },
    });

    // Cleanup function to destroy the chart when the component unmounts or dependencies change
    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, [
    region1Filter,
    region2Filter,
    ageFilter,
    yearFilter,
    ssbData,
    type,
  ]);

  return chartRef; // Return the chart reference
};
