import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
  reshapeValues,
  filterData,
  generateColor,
} from "@/utils/utils";

export const useChartSingle = (
  ssbData,
  regionFilter,
  ageFilter,
  yearFilter,
  ageRanges,
  type
) => {
  const chartRef = useRef(null);
  const myChartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !ssbData) return;

    // Extract the data from the ssbData object
    const regions = ssbData.dataset.dimension.Region.category.label;
    const ages = ssbData.dataset.dimension.Alder.category.label;
    const years = ssbData.dataset.dimension.Tid.category.label;
    const values = ssbData.dataset.value;

    // Extract the indices for regions, ages, and years
    const regionIndices =
      ssbData.dataset.dimension.Region.category.index;
    const ageIndices = ssbData.dataset.dimension.Alder.category.index;
    const yearIndices = ssbData.dataset.dimension.Tid.category.index;

    // Reshape the values from API into a more usable format
    const reshapedValues = reshapeValues(
      values,
      regionIndices,
      ageIndices,
      yearIndices,
      ages,
      years,
      ageRanges
    );

    // Format the data for the chart
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

    // Apply the filters to the formatted data
    let filteredData = filterData(
      formattedData,
      regionFilter,
      ageFilter,
      yearFilter
    );

    // If regionFilter is "Alle", aggregate the population data for each region
    if (regionFilter === "Alle") {
      filteredData = formattedData.map((item) => {
        const totalPopulation = item.ages.reduce((acc, ageItem) => {
          return (
            acc +
            ageItem.populations.reduce(
              (ageAcc, pop) => ageAcc + pop.population,
              0
            )
          );
        }, 0);
        return {
          region: item.region,
          totalPopulation,
        };
      });
    }

    // Prepare the data for the chart
    const chartData = {
      labels: filteredData.map((item) => item.region),
      datasets:
        regionFilter === "Alle"
          ? [
              {
                label: `Total befolkning i Norge - ${filteredData.reduce(
                  (acc, item) => acc + item.totalPopulation,
                  0
                )}`,
                data: filteredData.map(
                  (item) => item.totalPopulation
                ),
                backgroundColor: generateColor(0).backgroundColor,
                borderColor: generateColor(0).borderColor,
                borderWidth: 0.5,
              },
            ]
          : ageRanges.flatMap((range, rangeIndex) =>
              Object.keys(years).map((yearKey) => {
                const { backgroundColor, borderColor } =
                  generateColor(rangeIndex);
                return {
                  label: `${range.label} år`,
                  data: filteredData.map(
                    (item) =>
                      item.ages
                        .find(
                          (ageItem) => ageItem.age === range.label
                        )
                        ?.populations.find(
                          (pop) => pop.year === years[yearKey]
                        )?.population || 0
                  ),
                  backgroundColor,
                  borderColor,
                  borderWidth: 0.5,
                };
              })
            ),
    };

    // Destroy the previous chart instance and create a new one
    if (myChartRef.current) {
      myChartRef.current.destroy();
    }

    // Get the context of the chart canvas element
    const ctx = chartRef.current.getContext("2d");

    // Create a new chart instance
    myChartRef.current = new Chart(ctx, {
      type: type || "bar",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
            size: "small",
          },
          title: {
            display: false,
            text: "Befolkning i Norge",
          },
        },
      },
    });

    // Return a cleanup function
    return () => {
      if (myChartRef.current) {
        myChartRef.current.destroy();
      }
    };
  }, [regionFilter, ageFilter, yearFilter, ssbData, type]);

  return chartRef;
};
