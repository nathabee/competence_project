import React, { useEffect, useRef } from 'react';
import {
  Chart,
  RadialLinearScale,
  RadarController,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

// Register components
Chart.register(
  RadialLinearScale,
  RadarController,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart = ({ matiere, chartData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destroy any previous chart instances to avoid memory leaks
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Create new radar chart
    chartInstanceRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Avancement',
            data: chartData.data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: true,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Hide the legend
          },
        },
        scales: {
          r: {
            min: 0,
            max: 3,
            beginAtZero: true,
            ticks: {
              stepSize: 1, // Set step size to 1 to avoid fractional values
              callback: function (value, index, values) {
                // Provide custom labels for specific values
                const labels = ['',  '+', '++', '+++'];
                return labels[value] || ''; // Return custom labels or empty string
              },
            },
          },
        },
      },
    });



    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]); // Only re-run effect if chartData changes

  return <canvas ref={chartRef} />;
};

export default RadarChart;
