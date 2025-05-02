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

import { testSkuDefinition } from '@/context/WorkspaceContext/placeholder';
import { SKU, SKUDefinition } from '@/context/WorkspaceContext/types';
import { useWorkspace } from '@/hooks/useWorkspace';

import { InvoiceData } from './types';
import { calculationMap } from './unitCalculations';

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
        text: 'Usage + Costs',
      },
    },
  },
};

const skuUnits: { [key: string]: string } = {};

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
    const getData = async () => {
      if (!months.length) return;
      const datasets = [];
      for (const sku of skus) {
        let set = null;
        for (const ds of datasets) {
          if (ds.label.trim() === sku.item) {
            set = ds;
            break;
          }
        }

        await addUnit(sku);
        const unit = skuUnits[sku.item];

        let isNew = false;
        if (!set) {
          set = {
            label: `${sku.item} ${unit}`,
            data: [],
            backgroundColor: colours[datasets.length % colours.length],
            unit: unit,
          };
          isNew = true;
        }

        const skuMonth = getMonthInt(0, new Date(sku.event_end));
        for (let i = 0; i < months.length; i++) {
          if (months[i] === skuMonth) {
            if (!set.data[i]) set.data[i] = 0;
            const method = calculationMap[unit] ? calculationMap[unit] : calculationMap.cumulative;
            set.data[i] += method(sku);
          }
        }

        if (isNew && set.data.length > 0) {
          datasets.push(set);
        }
      }
      setData({
        labels: [monthsShort[months[0] - 1], monthsShort[months[1] - 1]],
        datasets,
      });
    };
    getData();
  }, [months, skus]);

  const addUnit = async (sku: SKU) => {
    try {
      if (skuUnits[sku.item] !== undefined) return;
      let skuDefinition: SKUDefinition;
      if (import.meta.env.VITE_WORKSPACE_LOCAL) {
        skuDefinition = testSkuDefinition;
      } else {
        const res = await fetch(`/api/accounting/skus/${sku.item}`);
        skuDefinition = await res.json();
      }
      skuUnits[sku.item] = skuDefinition.unit;
    } catch (error) {
      console.error(error);
    }
  };

  const getMonthInt = (offset = 0, date = new Date()) => {
    date.setMonth(date.getMonth() + offset);
    return parseInt(date.toLocaleString('en-US', { month: '2-digit' }));
  };

  const getCostsTotal = (offset = 0) => {
    if (!data) return;
    const values = [];
    data.datasets.forEach((dataset) => {
      if (dataset.unit === '' || !calculationMap[dataset.unit]) return;
      values.push(dataset.data);
    });
    let total = 0;
    values.forEach((value) => (total += value[value.length - (offset + 1)]));
    return total.toFixed(2);
  };

  const getUsageTotal = (offset = 0) => {
    if (!data) return;
    const values = [];
    data.datasets.forEach((dataset) => {
      if (dataset.unit !== '' && calculationMap[dataset.unit]) return;
      values.push(dataset.data);
    });
    let total = 0;
    values.forEach((value) => (total += value[value.length - (offset + 1)]));
    return total.toFixed(2);
  };

  const calculateRelativeToPreviousMonth = () => {
    const currMonthTotal = getCostsTotal();
    const prevMonthTotal = getCostsTotal(1);
    const ratio = parseFloat(
      ((parseFloat(currMonthTotal) / parseFloat(prevMonthTotal)) * 100).toFixed(1),
    );

    if (isNaN(ratio)) return '';

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
    const currMonthTotal = getCostsTotal();
    const prevMonthTotal = getCostsTotal(1);

    if (!currMonthTotal || !prevMonthTotal) return;
    return <span className="invoices-value__sub">{` ${calculateRelativeToPreviousMonth()}`}</span>;
  };

  return (
    <div className="invoices">
      <div></div>
      {data && <Bar data={data} options={options} />}
      <div className="invoices-value-container">
        <div>
          <span className="invoices-value__header">Current monthly</span>
          <div className="invoices-value__costs">
            {parseFloat(getCostsTotal()) > 0 ? (
              <div className="invoices-value__costs-item">
                <span className="invoices-value__costs-header">Costs: </span>
                <span className="invoices-value__costs-value">{` £${getCostsTotal()}`}</span>
              </div>
            ) : null}
            {parseFloat(getUsageTotal()) > 0 ? (
              <div className="invoices-value__costs-item">
                <span className="invoices-value__costs-header">Usage: </span>
                <span className="invoices-value__costs-value">{` ${getUsageTotal()}`}</span>
              </div>
            ) : null}
          </div>
        </div>
        {renderComparison()}
      </div>
    </div>
  );
};

export default Invoices;
