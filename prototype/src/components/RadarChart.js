import React, { useEffect, useRef } from 'react';
 

import {
  Chart ,
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

const RadarChart = ({ matiere, chartData, onChartReady }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);


useEffect(() => {
  const ctx = chartRef.current.getContext('2d');

  if (chartInstanceRef.current) {
    chartInstanceRef.current.destroy();
  }

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
      scales: {
        r: {
          min: 0,
          max: 3,
          beginAtZero: true,
        },
      },
    },
  });

  // Call the parent component's callback if needed
  if (onChartReady) {
    onChartReady(matiere, chartInstanceRef.current);
  }

  return () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
  };
}, [chartData, matiere, onChartReady]); // Add matiere and onChartReady here

  return <canvas ref={chartRef} id={`chart-${matiere}`} />;
};

export default RadarChart;

 