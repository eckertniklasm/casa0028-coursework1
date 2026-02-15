import { useMemo } from "react";
import populationData from "../data/ons-mye-population-totals.js";
import Barchart from './barchart';
import YearSelect from "./SelectYear.jsx";

function Statistics(props) {
  // Selected borough area from GeoJSON
  const hectares = props.selectedBorough?.properties?.HECTARES;
  const hectaresDisplay =
    typeof hectares === "number" ? hectares.toLocaleString() : "—";

  const { populationByArea, populationYearLabel } = useMemo(() => {
    // Build a lookup map once: borough name -> latest population value
    if (!Array.isArray(populationData) || populationData.length === 0) {
      return {
        populationByArea: new Map(),
        populationYearLabel: "",
      };
    }

    const yearKeys = Object.keys(populationData[0] || {})
      .filter((key) => /^\d{4}$/.test(key))
      .sort((a, b) => Number(a) - Number(b));

    const latestYear = yearKeys.at(-1);
    if (!latestYear) {
      return {
        populationByArea: new Map(),
        populationYearLabel: "",
      };
    }

    const map = new Map();
    populationData.forEach((row) => {
      const area = row["Area name"]?.trim();
      if (!area) return;

      const valueRaw = row[latestYear];
      if (valueRaw === undefined || valueRaw === null) return;
      const numeric = Number(
        String(valueRaw).replace(/[’']/g, "").replace(/,/g, "")
      );
      if (Number.isNaN(numeric)) return;

      map.set(area, numeric);
    });

    return {
      populationByArea: map,
      populationYearLabel: latestYear,
    };
  }, []);

  // Match selected borough to the population table
  const boroughName = props.selectedBorough?.properties?.BOROUGH;
  const population = boroughName ? populationByArea.get(boroughName) : undefined;
  const populationDisplay =
    typeof population === "number" ? population.toLocaleString() : "—";

  // Series/chart logic removed

  const populationLabel = populationYearLabel
    ? `Population (${populationYearLabel})`
    : "Population";

  return (
    <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistics for {boroughName}</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Area (ha)</p>
          <p className="text-2xl font-bold text-gray-900">
            {hectaresDisplay}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">{populationLabel}</p>
          <p className="text-2xl font-bold text-gray-900">
            {populationDisplay}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Population over time</p>
            <div className="mt-3">
            <Barchart selectedBorough={props.selectedBorough}/>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Select Year</p>
          <p className="text-2xl font-bold text-gray-900">
            {props.selectedYear}
          </p>
          <div className="text-2xl font-bold text-gray-900">
            <YearSelect
              yearRange={{ value: props.selectedYear }}
              setYearRange={(obj) => {
                if (typeof props.setSelectedYear === 'function') props.setSelectedYear(obj.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
