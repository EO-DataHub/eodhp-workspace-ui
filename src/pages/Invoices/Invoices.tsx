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

import { useWorkspace } from '@/hooks/useWorkspace';

import { InvoiceData } from './types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const colours = [
  'rgb(0, 123, 255)', // Vivid Blue
  'rgb(255, 82, 82)', // Strong Red
  'rgb(0, 200, 83)', // Rich Green
  'rgb(255, 193, 7)', // Strong Yellow/Amber
  'rgb(103, 58, 183)', // Deep Purple
  'rgb(233, 30, 99)', // Bold Pink
  'rgb(255, 145, 0)', // Deep Orange
  'rgb(33, 150, 243)', // Strong Sky Blue
  'rgb(76, 175, 80)', // Medium Green
  'rgb(156, 39, 176)', // Vivid Violet
];

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
      title: {
        display: true,
        text: 'Cost (£)',
      },
    },
  },
};

const Invoices = () => {
  const { skus } = useWorkspace();
  const [months, setMonths] = useState<number[]>([]);
  const [data, setData] = useState<InvoiceData>();

  useEffect(() => {
    const currentMonth = getMonthInt();
    const previousMonth = getMonthInt(-1);
    setMonths([previousMonth, currentMonth]);
  }, []);

  // We need to get the data in the correct for for chart.js.
  // Create a dataset for each type of sku and order the data correctly for the
  // current and previous month. Iterate through all the skus, find the relevant dataset,
  // find the month then add all of the values together.
  useEffect(() => {
    if (!months.length) return;
    const datasets = [];
    skus.forEach((sku) => {
      let set = datasets.filter((dataset) => {
        return dataset.label === sku.item;
      })[0];
      let ref = false;
      if (!set) {
        set = {
          label: sku.item,
          data: [],
          backgroundColor: colours[datasets.length % colours.length],
        };
        ref = true;
      }

      const skuMonth = getMonthInt(0, new Date(sku.event_end));
      months.forEach((month, index) => {
        if (month === skuMonth) {
          if (!set.data[index]) set.data[index] = 0;
          set.data[index] += sku.quantity;
        }
      });
      if (ref && set.data.length) datasets.push(set);
    });
    setData({
      labels: [monthsShort[months[0] - 1], monthsShort[months[1] - 1]],
      datasets,
    });
  }, [months, skus]);

  const getMonthInt = (offset = 0, date = new Date()) => {
    date.setMonth(date.getMonth() + offset);
    return parseInt(date.toLocaleString('en-US', { month: '2-digit' }));
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

  const renderComparison = () => {
    if (!data) return;
    const currMonthTotal = getTotal();
    const prevMonthTotal = getTotal(1);

    if (!currMonthTotal || !prevMonthTotal) return;
    return <span className="invoices-value__sub">{` ${calculateRelativeToPreviousMonth()}`}</span>;
  };

  return (
    <div className="invoices">
      <div></div>
      {data && <Bar data={data} options={options} />}
      <div className="invoices-value-container">
        <div>
          <span className="invoices-value__header">Current monthly costs</span>
          <span className="invoices-value__value">{` £${getTotal()}`}</span>
        </div>
        {renderComparison()}
      </div>
    </div>
  );
};

export default Invoices;
