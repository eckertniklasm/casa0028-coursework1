import { useState } from 'react';
import {Map, Source, Layer, Popup} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { boroughsData } from '../data/London_Boroughs';

function MapDisplay(props) {
  const [hoveredBorough, setHoveredBorough] = useState(null);

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
    <Map
      initialViewState={{
        longitude: props.longitude || -0.1,
        latitude: props.latitude || 51.0,
        zoom: props.zoom || 9.5
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
      <Source id="london-boroughs" type="geojson" data={boroughsData}>
        {/* Fill layer for boroughs */}
        <Layer
          id="borough-fills"
          type="fill"
          paint={{'fill-color': '#ffffff','fill-opacity': ['case',['boolean', ['feature-state', 'hover'], false],0.7,0.3]
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
    </Map>
  );
}
export default MapDisplay;