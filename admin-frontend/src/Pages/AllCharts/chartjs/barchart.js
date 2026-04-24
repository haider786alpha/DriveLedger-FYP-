import React from "react";
import { Bar } from "react-chartjs-2";

import 'chart.js/auto';
import { Chart, CategoryScale } from 'chart.js';
Chart.register(CategoryScale);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
  datasets: [
    {
      label: "Apple",
      data: [46, 57, 59, 54, 62, 58, 64, 60, 66],
      backgroundColor: "#eff2f7",
      barThickness: 10,
    },
    {
      label: "Samsung",
      data: [74, 83, 102, 97, 86, 106, 93, 114, 94],
      backgroundColor: "#3d8ef8",
      barThickness: 10,
    },
    {
      label: "Oppo",
      data: [37, 42, 38, 26, 47, 50, 54, 55, 43],
      backgroundColor: "#11c46e",
      barThickness: 10,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false,
      },
      ticks: {
        color: "#686868",
      },
    },
    y: {
      grid: {
        drawBorder: false,
      },
      ticks: {
        color: "#7b919e",
      },
      beginAtZero: true,
    },
  },
};

const BarChart = () => {
  return (
    <React.Fragment>
      <Bar width={537} height={268} data={data} options={options} />
    </React.Fragment>
  );
};

export default BarChart;
