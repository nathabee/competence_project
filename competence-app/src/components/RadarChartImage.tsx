'use client'; // Ensure client-side rendering

import React, { useEffect, useRef } from 'react';
import {
  Chart,
  RadialLinearScale,
  RadarController,
  LineElement,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(RadialLinearScale, RadarController, LineElement, PointElement, Filler, Tooltip, Legend);

interface RadarChartImageProps {
  chartData: {
    labels: string[];           // Text labels for radar chart axes
    data: number[];            // Data points
    labelImages: string[];     // Image data or paths for labels
  };
}

const RadarChartImage: React.FC<RadarChartImageProps> = ({ chartData }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  //const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 }); // Default size

  // Create an array of empty labels
  const labelEmpty = new Array(chartData.labels.length).fill("");

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');

    if (!ctx) return;

    // Destroy the old chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Load the images for the labels
    const labelImages: HTMLImageElement[] = chartData.labelImages.map((imagePath) => {
      const img = new Image();
      img.src = imagePath; // Use the Base64 image directly
  
      return img;
    });

    // Wait for all images to load
    Promise.all(labelImages.map((img) => new Promise<HTMLImageElement | null>((resolve) => {
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // Handle image load errors
    })))
    .then((loadedImages) => {
      // Create the radar chart
      chartInstanceRef.current = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: labelEmpty, // Use the empty labels array instead chartData.labels,
          datasets: [{
            label: 'Progress',
            data: chartData.data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)', 
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            fill: true,
          }],
        },
        options: {
          layout: {
            padding: {
              top: 40,
              bottom: 40,
              left: 40,
              right: 40,
            }},
          plugins: {
            legend: {
              display: false,
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
                  size: 7,
                },
              },
            },
          },
          animation: {
            onComplete: () => {
              const chartInstance = chartInstanceRef.current;
              if (chartInstance) {
                const { width, height } = chartInstance.chartArea;
                //setCanvasSize({ width, height }); // Set canvas size based on chart  
                const centerX = width / 2 + chartInstance.chartArea.left;
                const centerY = height / 2 + chartInstance.chartArea.top;
                const radius = Math.min(width, height) / 2;

                const numLabels = chartData.labels.length;

                // Loop through each label
                for (let i = 0; i < numLabels; i++) {
                  const angle = (i * (Math.PI * 2)) / numLabels - Math.PI / 2;
                  const xPos = centerX + radius * Math.cos(angle);
                  const yPos = centerY + radius * Math.sin(angle);

                  // Draw image
                  const img = loadedImages[i];
                  if (img) {
                    ctx.drawImage(img, xPos - 15, yPos - 30, 30, 30);
                  } else {
                    // Optional: Draw a placeholder if image fails to load
                    ctx.fillStyle = '#ccc';
                    ctx.fillRect(xPos - 15, yPos - 30, 30, 30); // Placeholder square
                  }

                  // Draw text
                  ctx.font = '10px Arial';
                  ctx.fillStyle = '#000';
                  ctx.fillText(chartData.labels[i], xPos - 20, yPos); // Adjust text position
                }
              }
            },
          },
        },
      });
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]);

  return <canvas ref={chartRef} width={800} height={600} />; 

};

export default RadarChartImage;
