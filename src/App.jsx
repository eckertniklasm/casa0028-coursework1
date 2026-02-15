import { useState } from 'react'
import TitleBar from './components/TitleBar'
import MapDisplay from './components/MapDisplay'
import Statistics from './components/Statistics'
import './tw-styles.css'
import Footer from './components/Footer'

function App() {
  const [selectedBorough, setSelectedBorough] = useState(null);

  const [selectedYear, setSelectedYear] = useState(2015);

  return (
    <div className="mx-auto max-w-screen-xl h-screen bg-white flex flex-col overflow-hidden">
      <TitleBar title="London Housing Over the Years" />
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        {/* Map Section - 2/3 width */}
        <div className="w-2/3 rounded-lg overflow-hidden shadow-lg">
          <MapDisplay longitude={-0.1} latitude={51.48} selectedBorough={selectedBorough} setSelectedBorough={setSelectedBorough} selectedYear={selectedYear} />
        </div>
        {/* Statistics Section - 1/3 width */}
        <Statistics selectedBorough={selectedBorough} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      </div>
      <Footer />
    </div>
  )
}

export default App
