import { useState, useMemo, useRef, useEffect } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { useChartSingle } from "@/hooks/useChart";
import { useChartDouble } from "@/hooks/useChartDouble";
import TilflyttingChart from "@/components/ChartTilflytting";
import { FilterSelector } from "@/components/FilterSelector";
import { ageRanges, calculateAverageAge } from "@/utils/utils";
import { FaChartColumn } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa6";

export default function Befolkning() {
  const { data1: ssbData, data2: ssbData2 } = useFetchData();
  const [regionFilter, setRegionFilter] = useState("Alle");
  const [ageFilter, setAgeFilter] = useState("Alle");
  const [yearFilter, setYearFilter] = useState("Alle");
  const [region1Filter, setRegion1Filter] = useState("");
  const [age1Filter, setAge1Filter] = useState("Alle");
  const [year1Filter, setYear1Filter] = useState("Alle");
  const [region2Filter, setRegion2Filter] = useState("");
  const [age2Filter, setAge2Filter] = useState("Alle");
  const [year2Filter, setYear2Filter] = useState("Alle");
  const [chartType, setChartType] = useState("bar");
  const [selectedRegions, setSelectedRegions] = useState([]);

  /**
   * =============================
   * Refs for the chart components
   * =============================
   */
  const chartRef = useChartSingle(
    ssbData,
    regionFilter,
    ageFilter,
    yearFilter,
    ageRanges,
    chartType
  );
  const chartRef1 = useChartSingle(
    ssbData,
    region1Filter,
    age1Filter,
    year1Filter,
    ageRanges,
    "bar"
  );
  const chartRef2 = useChartSingle(
    ssbData,
    region2Filter,
    age2Filter,
    year2Filter,
    ageRanges,
    "bar"
  );

  const chartRef3 = useChartDouble(
    ssbData,
    selectedRegions[0] || "",
    selectedRegions[1] || "",
    ageFilter,
    yearFilter,
    ageRanges,
    chartType
  );

  /**
   * ================================
   * Displaying
   * total population
   * average age
   * ================================
   */

  const totalPopulation = useMemo(() => {
    if (!ssbData) return 0;
    const values = ssbData.dataset.value;
    return values.reduce(
      (accumulator, value) => accumulator + value,
      0
    );
  }, [ssbData]);

  const averageAge = useMemo(() => {
    if (!ssbData) return 0;
    const values = ssbData.dataset.value;
    const ageLabels = ssbData.dataset.dimension.Alder.category.label;
    return calculateAverageAge(values, Object.values(ageLabels));
  }, [ssbData]);

  /**
   * =============================
   * If no data is loaded
   * =============================
   */

  if (!ssbData) {
    return (
      <main className="container mx-auto pt-14">
        <h1 className="text-5xl font-bold">Laster data...</h1>
      </main>
    );
  }

  /**
   * =============================
   * Redefining the data
   * =============================
   */
  const regions = ssbData.dataset.dimension.Region.category.label;
  const years = ssbData.dataset.dimension.Tid.category.label;
  const ages = ssbData.dataset.dimension.Alder.category.label;

  console.log(Object.entries(regions));

  const data2 = ssbData2.dataset;

  /**
   * =============================
   * Handling the filter changes
   * in the top section.
   * =============================
   */
  const handleRegionClick = (region) => {
    setSelectedRegions((prevSelectedRegions) => {
      if (prevSelectedRegions.includes(region)) {
        return prevSelectedRegions.filter((r) => r !== region);
      } else if (prevSelectedRegions.length < 2) {
        return [...prevSelectedRegions, region];
      } else {
        return [prevSelectedRegions[1], region];
      }
    });
  };
  // Button array Rendering the region populations - top section
  const renderRegionPopulations = () => {
    return Object.entries(regions).map(
      ([regionKey, regionName], index) => {
        const regionIndex =
          ssbData.dataset.dimension.Region.category.index[regionKey];
        const regionPopulation = ssbData.dataset.value
          .filter((_, idx) => {
            const regionIdx = Math.floor(
              idx /
                Object.keys(
                  ssbData.dataset.dimension.Alder.category.index
                ).length
            );
            return regionIdx === regionIndex;
          })
          .reduce((acc, val) => acc + val, 0);

        const isSelected = selectedRegions.includes(regionName);
        const isFirstSelected = selectedRegions[0] === regionName;
        const isSecondSelected = selectedRegions[1] === regionName;

        return (
          <div
            key={index}
            title={regionName}
            className={`text-xs py-1 px-2 bg-white/5 border border-slate-300/0 hover:border-slate-300/100 rounded-full cursor-pointer ${
              isFirstSelected
                ? "bg-green-600 text-slate-50"
                : isSecondSelected
                ? "bg-orange-600 text-slate-50"
                : ""
            }`}
            onClick={() => handleRegionClick(regionName)}>
            {regionName}:{" "}
            {new Intl.NumberFormat("no-NO").format(regionPopulation)}
          </div>
        );
      }
    );
  };

  /**
   * ================================
   * Handlers for the filter changes
   * ================================
   */
  const handleChartTypeChange = () => {
    setChartType((prevType) => (prevType === "bar" ? "line" : "bar"));
  };

  const handleRegion1Change = (event) => {
    setRegion1Filter(event.target.value);
  };

  const handleRegion2Change = (event) => {
    setRegion2Filter(event.target.value);
  };

  const handleAge1Change = (event) => {
    setAge1Filter(event.target.value);
    setAge2Filter(event.target.value);
  };

  const handleYear1Change = (event) => {
    setYear1Filter(event.target.value);
    setYear2Filter(event.target.value);
  };

  const handleYear2Change = (event) => {
    setYear2Filter(event.target.value);
  };

  /**
   * =============================
   * Format
   * total population
   * average age
   * =============================
   */
  const formattedTotalPopulation = new Intl.NumberFormat(
    "no-NO"
  ).format(totalPopulation);

  const formattedAverageAge = new Intl.NumberFormat("no-NO", {
    maximumFractionDigits: 0,
  }).format(averageAge);

  /**
   * =====================
   * Redefining the data2
   * =====================
   */
  const tilflyttingIndex =
    data2.dimension.ContentsCode.category.index["Tilflytting7"];

  const data2Array = Object.entries(
    data2.dimension.Region.category.label
  ).map(([key, label]) => {
    const regionIndex = data2.dimension.Region.category.index[key];
    const valueIndex =
      regionIndex *
        Object.keys(data2.dimension.ContentsCode.category.index)
          .length +
      tilflyttingIndex;
    const value = data2.value[valueIndex];
    return { id: key, label, value };
  });

  return (
    <main className="container  mx-auto pt-14 flex flex-col gap-8 pb-32">
      <div className="pb-4">
        <h1 className="text-5xl font-bold">Aldersoversikt i Norge</h1>
        <p className="text-slate-900/60 max-w-[55ch]">
          Få oversikt gjennom å sammenligne fylker basert på alder og
          sted.
        </p>
      </div>
      <section className="w-full flex flex-row gap-4">
        <div className="w-1/3 h-full ">
          <div className="relative w-full h-full flex flex-col gap-8 bg-slate-900 text-white text-2xl rounded-lg p-8">
            <div
              onClick={handleChartTypeChange}
              className="absolute top-8 right-8 border border-white/10 cursor-pointer w-fit p-4 rounded-md hover:bg-white/10">
              {chartType === "bar" ? (
                <FaChartColumn className="text-2xl" />
              ) : (
                <FaChartLine className="text-2xl " />
              )}
            </div>

            <div>
              <h3>Total befolkning i Norge:</h3>
              <h2 className="text-3xl font-bold">
                {formattedTotalPopulation}
              </h2>
            </div>
            <div>
              <h3>Gjennomsnittsalder :</h3>
              <h2 className="text-3xl font-bold">
                {formattedAverageAge} år
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {renderRegionPopulations()}
            </div>
          </div>
        </div>

        <div className="relative w-full lg:w-2/3 ">
          <canvas
            ref={chartRef3}
            className="w-full h-full cursor-help"></canvas>
        </div>
      </section>
      <section className="flex flex-col gap-4">
        <div className="pb-4">
          <h2 className="text-3xl font-bold">Sammenlign fylker :</h2>
          <p className="text-slate-900/60 italic">
            Sammenlign fylker basert på alder og år
          </p>
        </div>
        <div className="w-full flex flex-row gap-4">
          <div className="flex flex-row w-full gap-4">
            <FilterSelector
              id={1}
              filterValue={region1Filter}
              options={regions}
              handleChange={handleRegion1Change}
              label="Velg fylke 1"
            />
            <FilterSelector
              id={2}
              filterValue={region2Filter}
              options={regions}
              handleChange={handleRegion2Change}
              label="Velg fylke 2"
            />
          </div>
          <div className="flex flex-row w-full gap-4">
            <FilterSelector
              id={3}
              filterValue={age1Filter}
              options={ageRanges.reduce((acc, range) => {
                acc[range.label] = range.label;
                return acc;
              }, {})}
              handleChange={handleAge1Change}
              label="Velg alder"
            />
            <FilterSelector
              id={4}
              filterValue={year1Filter}
              options={years}
              handleChange={handleYear1Change}
              label="Velg år"
            />
          </div>
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-8">
          <div className="relative flex flex-row gap-4 justify-between w-full lg:w-1/2">
            <canvas
              ref={chartRef1}
              className="w-full h-full"></canvas>
            <canvas
              ref={chartRef2}
              className="w-full h-full"></canvas>
          </div>
        </div>
      </section>
      <section className="flex flex-row">
        <div className="w-full">
          <div className="pb-4">
            <h2 className="text-3xl font-bold">Tilflyttet :</h2>
            <p className="text-slate-900/60 italic">
              Antall mennesker flyttet til fylker iløpet av siste
              kvartal
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {data2Array.map((item) => (
              <div
                key={item.id}
                title={item.label}
                className="bg-white text-slate-900 flex gap-1 py-1 px-2 border rounded-full text-sm">
                <p className="font-bold">{item.label}</p>
                <p className="text-salte-900/60">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full">
          <TilflyttingChart data={data2Array} />
        </div>
      </section>
    </main>
  );
}
