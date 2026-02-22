import { useMemo } from "react";
import populationData from "../data/ons-mye-population-totals.js";
import rentData from "../data/local-authority-rents-boroughjs";
import Barchart from './barchart';
import YearSelect from "./SelectYear.jsx";

// Statistics sidebar displaying metrics and controls for selected borough
function Statistics(props) {
  // Selected borough area from GeoJSON
  const hectares = props.selectedBorough?.properties?.HECTARES;
  const hectaresDisplay =
    typeof hectares === "number" ? hectares.toLocaleString() : "—";

  // Compute latest population data for all boroughs
  const { populationByArea, populationYearLabel } = useMemo(() => {
    // Build lookup map: borough name -> latest population value
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

  // Get population for selected borough
  const boroughName = props.selectedBorough?.properties?.BOROUGH;
  const population = boroughName ? populationByArea.get(boroughName) : undefined;
  const populationDisplay =
    typeof population === "number" ? population.toLocaleString() : "—";

  // Get rent value for selected borough and year
  const rentRow = boroughName
    ? rentData.find((r) => String(r["Area name"] || "").trim() === String(boroughName).trim())
    : null;
  const rentRaw = rentRow ? rentRow[String(props.selectedYear)] : undefined;
  const rentNumeric = rentRaw === undefined || rentRaw === null ? null : Number(String(rentRaw).replace(/[’']/g, "").replace(/,/g, ""));
  const rentDisplay = typeof rentNumeric === "number" ? rentNumeric.toLocaleString() : "—";
  const rentLabel = props.selectedYear ? `Rent (Weekly Rent in £)` : "Rent";

  const populationLabel = populationYearLabel
    ? `Population (${populationYearLabel})`
    : "Population";

  const metricLabel = props.metric === 'rent' ? rentLabel : populationLabel;
  const metricDisplay = props.metric === 'rent' ? rentDisplay : populationDisplay;

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
          <p className="text-gray-600 text-sm">{metricLabel}</p>
          <p className="text-2xl font-bold text-gray-900">
            {metricDisplay}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">{props.metric === 'rent' ? 'Rent over time' : 'Population over time'}</p>
          <div className="mt-3">
            <Barchart selectedBorough={props.selectedBorough} metric={props.metric} />
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
        <div className="bg-white p-4 rounded-lg flex items-center justify-between">
          <div className="text-sm text-gray-600">Metric:</div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => props.setMetric && props.setMetric('population')}
              style={{ backgroundColor: props.metric === 'population' ? '#08306b' : undefined, color: props.metric === 'population' ? '#fff' : undefined }}
              className="px-3 py-1 rounded border"
            >
              Population
            </button>
            <button
              type="button"
              onClick={() => props.setMetric && props.setMetric('rent')}
              style={{ backgroundColor: props.metric === 'rent' ? '#a50f15' : undefined, color: props.metric === 'rent' ? '#fff' : undefined }}
              className="px-3 py-1 rounded border"
            >
              Rent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
