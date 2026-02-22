import { useState, useMemo } from 'react';
import MapGL, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { boroughsData } from '../data/London_Boroughs';
import populationData from '../data/ons-mye-population-totals.js';
import rentData from '../data/local-authority-rents-boroughjs';

// Interactive map component displaying London boroughs with choropleth visualization
function MapDisplay(props) {
  const [hoveredBorough, setHoveredBorough] = useState(null);

  const boroughsWithPop = useMemo(() => {
    // Select data source based on metric type
    const isRent = props.metric === 'rent';
    const dataSource = isRent ? rentData : populationData;
    if (!Array.isArray(dataSource) || dataSource.length === 0) return boroughsData;

    // Year to use
    const year = String(props.selectedYear ?? 2015);

    // Build lookup: area name -> numeric metric value for the chosen year
    const popLookup = new Map();
    dataSource.forEach((row) => {
      const area = (row['Area name'] || row['Area name'])?.trim();
      if (!area) return;
      const valueRaw = row[year];
      if (valueRaw === undefined || valueRaw === null) return;
      const cleaned = String(valueRaw).replace(/[’' ]/g, '').replace(/,/g, '');
      if (cleaned === '.' || cleaned === '') return;
      const numeric = Number(cleaned);
      if (Number.isNaN(numeric)) return;
      popLookup.set(area, numeric);
    });

    // Clone GeoJSON and attach computed metric property where available
    const copy = JSON.parse(JSON.stringify(boroughsData));
    copy.features.forEach((f) => {
      const area = (f.properties?.BOROUGH || f.properties?.NAME || f.properties?.name || '').trim();
      const val = popLookup.get(area);
      f.properties = f.properties || {};
      if (typeof val === 'number') {
        f.properties.METRIC_VALUE = val;
      } else {
        // ensure property is absent when no value
        if (Object.prototype.hasOwnProperty.call(f.properties, 'METRIC_VALUE')) {
          delete f.properties.METRIC_VALUE;
        }
      }
    });

    return copy;
  }, [props.selectedYear, props.metric]);

  const colorExpression = useMemo(() => {
    // compute min/max across features
    const values = (boroughsWithPop.features || [])
      .map((f) => f.properties?.METRIC_VALUE)
      .filter((v) => typeof v === 'number');
    if (values.length === 0) return '#6b7280';
    const min = Math.min(...values);
    const max = Math.max(...values);
    const isRent = props.metric === 'rent';
    const light = isRent ? '#fff5f0' : '#f7fbff';
    const dark = isRent ? '#a50f15' : '#08306b';

    if (min === max) {
      // single color for all; gray for missing
      return ['case', ['!', ['has', 'METRIC_VALUE']], '#6b7280', dark];
    }

    // If METRIC_VALUE is missing -> show gray, otherwise interpolate from light to dark
    return [
      'case',
      ['!', ['has', 'METRIC_VALUE']],
      '#6b7280',
      ['interpolate', ['linear'], ['get', 'METRIC_VALUE'],
        min, light,
        max, dark
      ]
    ];
  }, [boroughsWithPop, props.metric]);

  const minMax = useMemo(() => {
    const values = (boroughsWithPop.features || [])
      .map((f) => f.properties?.METRIC_VALUE)
      .filter((v) => typeof v === 'number');
    if (values.length === 0) return null;
    return { min: Math.min(...values), max: Math.max(...values) };
  }, [boroughsWithPop]);

  const handleBoroughClick = (e) => {
    if (e.features.length > 0) {
      const feature = e.features[0];
      props.setSelectedBorough({
        lngLat: e.lngLat,
        properties: feature.properties
      });
    }
  };

  return (
    <MapGL
      initialViewState={{
        longitude: props.longitude || -0.1,
        latitude: props.latitude || 51.0,
        zoom: props.zoom || 9.0
      }}
      style={{width: '100%', height: '100%'}}
      mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      interactiveLayerIds={['borough-fills', 'borough-borders']}

      onMouseMove={(e) => {
        const feature = e.features?.[0] || null;
        setHoveredBorough(feature);
      }}
      
      onMouseLeave={() => setHoveredBorough(null)}

      onClick={handleBoroughClick}
      >
      <Source id="london-boroughs" type="geojson" data={boroughsWithPop}>
        {/* Fill layer for boroughs */}
        <Layer
          id="borough-fills"
          type="fill"
          paint={{
            'fill-color': colorExpression,
            'fill-opacity': ['case',['boolean', ['feature-state', 'hover'], false],0.8,0.6]
          }}
        />
        {/* Border layer for boroughs */}
        <Layer
          id="borough-borders"
          type="line"
          paint={{'line-color': '#333333','line-width': 2}}
        />
        {/* Symbol layer for borough names */}
        {/* <Layer
          id="borough-labels"
          type="symbol"
          layout={{'text-field': ['get', 'BOROUGH'],'text-size': 12,'text-offset': [0, 0],'text-anchor': 'center'}}
          paint={{'text-color': '#333333','text-halo-color': '#ffffff','text-halo-width': 1}}
        /> */}
      </Source>
      {hoveredBorough?.properties?.BOROUGH && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-md shadow text-sm font-semibold text-gray-900">
          {hoveredBorough.properties.BOROUGH}
        </div>
      )}
      {/* Color bar legend at bottom center */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-16 z-50 pointer-events-auto">
        <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-md shadow flex items-center space-x-3">
          {minMax ? (
            <>
              <span className="text-xs text-gray-600">{minMax.min.toLocaleString()}</span>
              <div className="w-48 h-3 rounded" style={{ background: `linear-gradient(90deg, ${props.metric === 'rent' ? '#fff5f0' : '#f7fbff'}, ${props.metric === 'rent' ? '#a50f15' : '#08306b'})` }} />
              <span className="text-xs text-gray-600">{minMax.max.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-xs text-gray-600">No population data</span>
          )}
        </div>
      </div>
    </MapGL>
  );
}
export default MapDisplay;