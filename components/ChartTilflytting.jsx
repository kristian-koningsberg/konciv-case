// TilflyttingChart.jsx
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const TilflyttingChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const labels = data.map((item) => item.label);
    const values = data.map((item) => item.value);

    const chartData = {
      labels,
      datasets: [
        {
          label: "Tilflytting",
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          fill: true,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
          text: "Tilflytting per Fylke",
        },
      },
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "bar",
      data: chartData,
      options,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <canvas
      ref={chartRef}
      className="w-full"></canvas>
  );
};

export default TilflyttingChart;
