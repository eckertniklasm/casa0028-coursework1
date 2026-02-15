import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import populationData from '../data/ons-mye-population-totals.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SimpleChart(props) {
    const selectedBorough = props.selectedBorough;
    const boroughName = props.boroughName || selectedBorough?.properties?.BOROUGH;

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false,
                text: 'Population over time',
            },
        },
    };

    if (!boroughName || !Array.isArray(populationData) || populationData.length === 0) {
        return (
            <p className="text-sm text-gray-500 mt-2">Select a borough to view the bar chart.</p>
        );
    }

    const yearKeys = Object.keys(populationData[0] || {})
        .filter((key) => /^\d{4}$/.test(key))
        .sort((a, b) => Number(a) - Number(b));

    const row = populationData.find(
        (r) => String(r['Area name'] || '').trim() === String(boroughName).trim()
    );

    const labels = yearKeys;
    const values = labels.map((year) => {
        const valueRaw = row?.[year];
        if (valueRaw === undefined || valueRaw === null) return null;
        const numeric = Number(String(valueRaw).replace(/[’']/g, '').replace(/,/g, ''));
        return Number.isNaN(numeric) ? null : numeric;
    });

    const data = {
        labels,
        datasets: [
            {
                label: boroughName,
                data: values,
                backgroundColor: '#08306b',
            },
        ],
    };

    return <Bar data={data} options={options} />;
}