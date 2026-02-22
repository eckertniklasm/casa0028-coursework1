import { useState, useEffect } from 'react';

// Year slider component for selecting data year (1996-2015)
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
      <input
        type="range"
        id="year"
        min={1996}
        max={2015}
        value={selectedYear ?? ''}
        className="w-64"
        style={{ accentColor: '#000000' }}
        onChange={handleChange}
      />
    </div>
  );
}