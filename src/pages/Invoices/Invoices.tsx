import React, { useEffect, useState } from 'react';
import './styles.scss';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { InvoiceData } from './types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Cost and usage',
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

const Invoices = () => {
  const [months, setMonths] = useState<string[]>([]);
  const [data, setData] = useState<InvoiceData>();

  useEffect(() => {
    const currentMonth = getMonthString();
    const previousMonth = getMonthString(-1);
    setMonths([previousMonth, currentMonth]);
  }, []);

  useEffect(() => {
    if (!months.length) return;
    setData({
      labels: months,
      datasets: [
        {
          label: 'Compute',
          data: months.map(() => getRandomNumber(-1000, 1000)),
          backgroundColor: 'rgb(255, 99, 132)',
        },
        {
          label: 'Storage',
          data: months.map(() => getRandomNumber(-1000, 1000)),
          backgroundColor: 'rgb(75, 192, 192)',
        },
        {
          label: 'Processing',
          data: months.map(() => getRandomNumber(-1000, 1000)),
          backgroundColor: 'rgb(53, 162, 235)',
        },
      ],
    });
  }, [months]);

  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + 1;
  };

  const getMonthString = (offset = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toLocaleString('en-US', { month: 'long' });
  };

  const getTotal = (offset = 0) => {
    if (!data) return;
    const values = data.datasets.map((dataset) => {
      return dataset.data;
    });
    let total = 0;
    values.forEach((value) => (total += value[value.length - (offset + 1)]));
    return total;
  };

  const calculateRelativeToPreviousMonth = () => {
    if (!data) return;
    const currMonthTotal = getTotal();
    const prevMonthTotal = getTotal(1);
    const ratio = parseFloat(((currMonthTotal / prevMonthTotal) * 100).toFixed(1));

    if (ratio < 100) {
      return `${(100 - ratio).toFixed(1)}% less compared to last month `;
    }
    if (ratio > 100) {
      return `${(ratio - 100).toFixed(1)}% more compared to last month`;
    }
    if (ratio === 100) {
      return `No change in usage compared to last month`;
    }
  };

  return (
    <div className="invoices">
      {data && <Bar data={data} options={options} />}
      <div className="invoices-value-container">
        <div>
          <span className="invoices-value__header">Current monthly costs</span>
          <span className="invoices-value__value">{` £${getTotal()}`}</span>
        </div>

        <span className="invoices-value__sub">{` ${calculateRelativeToPreviousMonth()}`}</span>
      </div>
    </div>
  );
};

export default Invoices;
