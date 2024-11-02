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

// Register the necessary components for the radar chart
Chart.register(RadialLinearScale, RadarController, LineElement, PointElement, Filler, Tooltip, Legend);

// Define props type for RadarChart
interface RadarChartProps { 
    chartData: {
        labels: string[];  // Labels for the radar chart axes
        data: number[];    // Data points for the radar chart
    };
}

const RadarChart: React.FC<RadarChartProps> = ({ chartData }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);

    useEffect(() => {
        const ctx = chartRef.current?.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) return;

        // Destroy previous chart instance to avoid memory leaks
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        // Create a new radar chart
        chartInstanceRef.current = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: chartData.labels,  // Groupage labels
                datasets: [{
                    label: 'Avancement',
                    data: chartData.data,  // Avancement scores
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: true,
                }],
            },
            options: {
                responsive: true, // Enable responsive resizing
                maintainAspectRatio: false, // Allow chart to resize without maintaining aspect ratio
                plugins: {
                    legend: {
                        display: false,  // Hide legend
                    },
                },
                scales: {
                    r: {
                        min: 0,
                        max: 3,
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            callback: (tickValue: string | number) => {
                                const labels = ['', '+', '++', '+++'];
                                const index = typeof tickValue === 'number' ? tickValue : Number(tickValue);
                                return labels[index] || '';
                            },
                            font: {
                                size: 7, // Smaller font size
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
    }, [chartData]);

    
    return (
      <div style={{ 
          height: '12cm', // Maximum height of the chart container
          width: '100%',   // Full width to take advantage of the printable area
          overflow: 'hidden' // Hide overflow to maintain cleanliness
      }}> 
          <canvas 
              ref={chartRef} 
              width={728}  // Width for better resolution
              height={300} // Height corresponding to 12cm
          />
      </div>
  );
};

export default RadarChart;
