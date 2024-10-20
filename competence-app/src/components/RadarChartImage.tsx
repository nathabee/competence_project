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

    // Helper function to format the text to 120 characters, right-aligned
  const formatText = (text: string, width: number): string => {
    if (text.length > width) {
      // If the text is too long, cut it from the left
      return text.slice(text.length - width);
    } else {
      // Otherwise, pad it with spaces on the left
      const padding = ' '.repeat(width - text.length);
      return padding + text;
    }
  };



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
          responsive: false,  //see https://www.geeksforgeeks.org/how-to-set-height-and-width-of-a-chart-in-chart-js/
          layout: {
            padding: {
              top: 40,  //40
              bottom: 40, //40
              left: 120,  //120
              right: 120,  //120
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
                  return labels[index] ||  ' '.repeat(50); ;  //place holder 
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
                console.log("chartInstance width",chartInstance.width)
                console.log("chartInstance height",chartInstance.height)
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


                  ctx.font = 'bold 8px Verdana';
                  ctx.fillStyle = '#000';
                  if (Math.cos(angle) > 0 )
                    ctx.fillText(chartData.labels[i], xPos   , yPos - 30);
                  else
                    ctx.fillText(formatText(chartData.labels[i], 50), xPos - 120 , yPos - 30);

                  
 
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

  return <canvas ref={chartRef} 
                width={ 728}  
                height={ 564}   />;  // width={484+120+120} height={484+40+40} />; 

};

export default RadarChartImage;
