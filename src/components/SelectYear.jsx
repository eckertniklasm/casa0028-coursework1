import { useState, useEffect } from 'react';

export default function YearSelect(props) {
  const initial = typeof props.yearRange?.value === 'number' ? props.yearRange.value : 1961;
  const [selectedYear, setSelectedYear] = useState(initial);

  useEffect(() => {
    const external = props.yearRange?.value;
    if (typeof external === 'number' && external !== selectedYear) {
      setSelectedYear(external);
    }
  }, [props.yearRange?.value]);

  function handleChange(e) {
    const raw = e?.target?.value;
    if (raw === undefined) return;
    const numeric = raw === '' ? null : Number(raw);
    setSelectedYear(numeric);
    if (typeof props.setYearRange === 'function') {
      props.setYearRange({ value: numeric });
    }
  }

  return (
    <div className="w-full flex items-center">
      <div>
        <div className="flex items-center">
          <label htmlFor="year" className="text-sm text-gray-700 mr-2"></label>

          <input
            type="range"
            id="year"
            min={1961}
            max={2015}
            value={selectedYear ?? ''}
            className="w-64"
            style={{ accentColor: '#08306b' }}
            onChange={handleChange}
          />

          <div className="w-16 text-right ml-3">
          
          </div>
        </div>
      </div>
    </div>
  );
}