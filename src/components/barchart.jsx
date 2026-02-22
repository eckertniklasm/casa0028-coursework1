import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import populationData from '../data/ons-mye-population-totals.js';
import rentData from '../data/local-authority-rents-boroughjs';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// Bar chart component displaying metric over time for selected borough
export default function SimpleChart(props) {
    const selectedBorough = props.selectedBorough;
    const boroughName = props.boroughName || selectedBorough?.properties?.BOROUGH;

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y.toLocaleString()}`,
                }
            }
        },
    };

    const isRent = props.metric === 'rent';
    const dataSource = isRent ? rentData : populationData;

    // Show message if no borough is selected
    if (!boroughName || !Array.isArray(dataSource) || dataSource.length === 0) {
        return (
            <p className="text-sm text-gray-500 mt-2">Select a borough to view the chart.</p>
        );
    }

    const allYears = Object.keys(dataSource[0] || {}).filter((key) => /^\d{4}$/.test(key));
    const yearKeys = allYears
        .map(Number)
        .filter((y) => y >= 1996 && y <= 2015)
        .sort((a, b) => a - b)
        .map(String);

    const row = dataSource.find(
        (r) => String(r['Area name'] || '').trim() === String(boroughName).trim()
    );

    const labels = yearKeys;
    const values = labels.map((year) => {
        const valueRaw = row?.[year];
        if (valueRaw === undefined || valueRaw === null) return null;
        const numeric = Number(String(valueRaw).replace(/[’']/g, '').replace(/,/g, ''));
        return Number.isNaN(numeric) ? null : numeric;
    });

    const color = isRent ? '#a50f15' : '#08306b';

    const data = {
        labels,
        datasets: [
            {
                label: boroughName,
                data: values,
                backgroundColor: color,
            },
        ],
    };

    return <Bar data={data} options={options} />;
}