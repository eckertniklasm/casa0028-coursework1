import { useState } from 'react'
import TitleBar from './components/TitleBar'
import MapDisplay from './components/MapDisplay'
import Statistics from './components/Statistics'
import './tw-styles.css'
import Footer from './components/Footer'

// Main App component managing global state
function App() {
  // State for selected borough location and properties
  const [selectedBorough, setSelectedBorough] = useState(null);
  // State for currently selected year (1996-2015)
  const [selectedYear, setSelectedYear] = useState(2015);
  // State for metric display: 'population' or 'rent'
  const [metric, setMetric] = useState('population');

  return (
    <div className="mx-auto max-w-screen-xl h-screen bg-white flex flex-col overflow-hidden">
      <TitleBar title="London Housing Over the Years" />
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Map display showing London boroughs with data visualization */}
        <div className="w-2/3 rounded-lg overflow-hidden shadow-lg">
          <MapDisplay longitude={-0.1} latitude={51.48} selectedBorough={selectedBorough} setSelectedBorough={setSelectedBorough} selectedYear={selectedYear} metric={metric} />
        </div>
        {/* Right sidebar with statistics and controls */}
        <Statistics
          selectedBorough={selectedBorough}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          metric={metric}
          setMetric={setMetric}
        />
      </div>
      <Footer />
    </div>
  )
}

export default App
