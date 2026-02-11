import { useMemo } from "react";
import populationData from "../data/ons-mye-population-totals.js";

function Statistics(props) {
  // Selected borough area from GeoJSON
  const hectares = props.selectedBorough?.properties?.HECTARES;
  const hectaresDisplay =
    typeof hectares === "number" ? hectares.toLocaleString() : "—";

  const { populationByArea, populationYearLabel, populationSeriesByArea, yearKeys } =
    useMemo(() => {
    // Build a lookup map once: borough name -> latest population value
    if (!Array.isArray(populationData) || populationData.length === 0) {
      return {
        populationByArea: new Map(),
        populationYearLabel: "",
        populationSeriesByArea: new Map(),
        yearKeys: [],
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
        populationSeriesByArea: new Map(),
        yearKeys: [],
      };
    }

    const map = new Map();
    const seriesMap = new Map();
    populationData.forEach((row) => {
      const area = row["Area name"]?.trim();
      if (!area) return;

      const series = yearKeys.map((year) => {
        const valueRaw = row[year];
        if (valueRaw === undefined || valueRaw === null) return null;
        const numeric = Number(
          String(valueRaw).replace(/[’']/g, "").replace(/,/g, "")
        );
        return Number.isNaN(numeric) ? null : numeric;
      });

      seriesMap.set(area, series);

      const latestValue = series.at(-1);
      if (typeof latestValue !== "number") return;

      // Normalize values like 123’456 into a usable number
      map.set(area, latestValue);
    });

    return {
      populationByArea: map,
      populationYearLabel: latestYear,
      populationSeriesByArea: seriesMap,
      yearKeys,
    };
  }, []);

  // Match selected borough to the population table
  const boroughName = props.selectedBorough?.properties?.BOROUGH;
  const population = boroughName ? populationByArea.get(boroughName) : undefined;
  const populationDisplay =
    typeof population === "number" ? population.toLocaleString() : "—";

  // Retrieve the full year-by-year series for the selected borough
  const populationSeries = boroughName
    ? populationSeriesByArea.get(boroughName)
    : null;

  const populationSeriesValues = Array.isArray(populationSeries)
    ? populationSeries
    : [];

  const numericSeries = populationSeriesValues.filter(
    (value) => typeof value === "number"
  );

  // Prepare a simple line chart from the series values
  const hasSeries = numericSeries.length > 1;
  const seriesMin = Math.min(...numericSeries);
  const seriesMax = Math.max(...numericSeries);
  const seriesRange = seriesMax - seriesMin || 1;
  const chartWidth = 320;
  const chartHeight = 120;
  const chartPadding = 12;
  const chartInnerWidth = chartWidth - chartPadding * 2;
  const chartInnerHeight = chartHeight - chartPadding * 2;
  const chartStep = populationSeriesValues.length > 1
    ? chartInnerWidth / (populationSeriesValues.length - 1)
    : 0;
  const chartPoints = hasSeries
    ? populationSeriesValues
        .map((value, index) => {
          if (typeof value !== "number") return null;
          const x = chartPadding + index * chartStep;
          const y =
            chartPadding +
            chartInnerHeight * (1 - (value - seriesMin) / seriesRange);
          return `${x},${y}`;
        })
        .filter(Boolean)
        .join(" ")
    : "";

  const populationLabel = populationYearLabel
    ? `Population (${populationYearLabel})`
    : "Population";

  return (
    <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistics for {boroughName}</h2>
      <div className="space-y-4">
        {/* Statistics placeholders */}
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
          {hasSeries ? (
            <div className="mt-3">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-28"
                role="img"
                aria-label="Population change over time"
              >
                <polyline
                  points={chartPoints}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{yearKeys[0]}</span>
                <span>{yearKeys[yearKeys.length - 1]}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Select a borough to view the time series.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Statistics;
