// Description: This file contains utility functions that are used in the application.

// Redefine the age ranges
export const ageRanges = [
  { label: "0-10", min: 0, max: 10 },
  { label: "10-16", min: 10, max: 16 },
  { label: "16-25", min: 16, max: 25 },
  { label: "25-35", min: 25, max: 35 },
  { label: "35-45", min: 35, max: 45 },
  { label: "45-55", min: 45, max: 55 },
  { label: "55-65", min: 55, max: 65 },
  { label: "65-75", min: 65, max: 75 },
  { label: "75-85", min: 75, max: 85 },
  { label: "85+", min: 85, max: Infinity },
];

// Get the age range label for a given age
export const getAgeRange = (age, ageRanges) => {
  return ageRanges.find(
    (range) => age >= range.min && age < range.max
  ).label;
};

// Reshape the values from SSB API into a more usable format.
export const reshapeValues = (
  values,
  regionIndices,
  ageIndices,
  yearIndices,
  ages,
  years,
  ageRanges
) => {
  const reshapedValues = {};

  values.forEach((population, idx) => {
    const regionIdx = Math.floor(
      idx / (Object.keys(ages).length * Object.keys(years).length)
    );
    const remainder =
      idx % (Object.keys(ages).length * Object.keys(years).length);
    const ageIdx = Math.floor(remainder / Object.keys(years).length);
    const yearIdx = remainder % Object.keys(years).length;

    const regionKey = Object.keys(regionIndices).find(
      (key) => regionIndices[key] === regionIdx
    );
    const ageKey = Object.keys(ageIndices).find(
      (key) => ageIndices[key] === ageIdx
    );
    const yearKey = Object.keys(yearIndices).find(
      (key) => yearIndices[key] === yearIdx
    );

    const ageRange = getAgeRange(parseInt(ages[ageKey]), ageRanges);

    if (!reshapedValues[regionKey]) reshapedValues[regionKey] = {};
    if (!reshapedValues[regionKey][ageRange])
      reshapedValues[regionKey][ageRange] = {};
    if (!reshapedValues[regionKey][ageRange][yearKey])
      reshapedValues[regionKey][ageRange][yearKey] = 0;

    reshapedValues[regionKey][ageRange][yearKey] += population;
  });

  return reshapedValues;
};

// Filter the formatted data based on the selected filters
export const filterData = (
  formattedData,
  regionFilter,
  ageFilter,
  yearFilter
) => {
  let filteredData = formattedData;

  if (regionFilter !== "Alle") {
    filteredData = filteredData.filter(
      (item) => item.region === regionFilter
    );
  }

  if (ageFilter !== "Alle") {
    filteredData = filteredData.map((item) => ({
      ...item,
      ages: item.ages.filter((ageItem) => ageItem.age === ageFilter),
    }));
  }

  if (yearFilter !== "Alle") {
    filteredData = filteredData.map((item) => ({
      ...item,
      ages: item.ages.map((ageItem) => ({
        ...ageItem,
        populations: ageItem.populations.filter(
          (pop) => pop.year === yearFilter
        ),
      })),
    }));
  }

  return filteredData;
};

// Generate colors for the chart
export const generateColor = (index) => {
  const colors = [
    "rgba(75, 192, 192, 0.6)",
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    "rgba(0, 128, 0, 0.6)",
    "rgba(128, 0, 128, 0.6)",
  ];
  const borderColors = [
    "rgba(75, 192, 192, 1)",
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(153, 102, 255, 1)",
    "rgba(255, 159, 64, 1)",
    "rgba(0, 128, 0, 1)",
    "rgba(128, 0, 128, 1)",
  ];
  return {
    backgroundColor: colors[index % colors.length],
    borderColor: borderColors[index % borderColors.length],
  };
};

// Calculate the average age of the population
export const calculateAverageAge = (values, ageLabels) => {
  let totalPopulation = 0;
  let totalWeightedAge = 0;

  // Loop through the values and calculate the average age
  values.forEach((population, idx) => {
    const ageLabel = ageLabels[idx % ageLabels.length];
    const age = parseInt(ageLabel, 10);
    // console.log(`Population: ${population}, Age: ${age}`);
    totalPopulation += population;
    totalWeightedAge += population * age;
  });

  // console.log(
  //   `Total Population: ${totalPopulation}, Total Weighted Age: ${totalWeightedAge}`
  // );
  return totalWeightedAge / totalPopulation;
};
