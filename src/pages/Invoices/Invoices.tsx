/* eslint-disable react-hooks/exhaustive-deps */
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

import memberGroupIcon from '@/assets/icons/member-group.svg';
import { pricesPlaceholder, testSkuDefinition } from '@/context/WorkspaceContext/placeholder';
import { SKU, SKUDefinition } from '@/context/WorkspaceContext/types';
import { useWorkspace } from '@/hooks/useWorkspace';

import { InvoiceData, Price } from './types';

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
        text: 'Usage',
      },
    },
  },
};

const skuUnits: { [key: string]: string } = {};
const skuUnitsWarnings: string[] = [];

const Invoices = () => {
  const { skus } = useWorkspace();
  const [months, setMonths] = useState<number[]>([]);
  const [data, setData] = useState<InvoiceData>();
  const [prices, setPrices] = useState<Price[]>([]);

  useEffect(() => {
    const currentMonth = getMonthInt();
    const previousMonth = getMonthInt(-1);
    setMonths([previousMonth, currentMonth]);
  }, []);

  useEffect(() => {
    const getPrices = async () => {
      if (import.meta.env.VITE_WORKSPACE_LOCAL) {
        setPrices(pricesPlaceholder);
      } else {
        const res = await fetch('/api/accounting/prices');
        const _prices = await res.json();
        setPrices(_prices);
      }
    };
    getPrices();
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
          if (ds.label.split(' ')[0] === sku.item) {
            set = ds;
            break;
          }
        }

        await addUnit(sku);
        const unit = skuUnits[sku.item];

        const price = getSKUPrice(sku.item);
        if (!price) {
          const warning = `Warning: No pricing available for ${sku.item}. ${sku.item} will use usage not final cost`;
          const index = skuUnitsWarnings.indexOf(warning);
          if (index === -1) {
            skuUnitsWarnings.push(warning);
          }
        }

        let isNew = false;
        if (!set) {
          set = {
            label: `${sku.item}`,
            data: [0, 0],
            backgroundColor: colours[datasets.length % colours.length],
            unit: unit,
            price: price?.price,
          };
          isNew = true;
        }

        const skuMonth = getMonthInt(0, new Date(sku.event_end));
        for (let i = 0; i < months.length; i++) {
          if (months[i] === skuMonth) {
            set.data[i] += sku.quantity;
          }
        }

        if (isNew && set.data.length > 0) {
          let sum = 0;
          set.data.forEach((val) => (sum += val));
          if (sum > 0) {
            datasets.push(set);
          }
        }
      }
      setData({
        labels: [monthsShort[months[0] - 1], monthsShort[months[1] - 1]],
        datasets,
      });
    };
    getData();
  }, [months, skus]);

  const getSKUPrice = (skuName: string): Price => {
    return prices.filter((price) => price.sku === skuName)[0];
  };

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

  const getUsageTotal = (offset = 0) => {
    if (!data) return;
    const values = [];
    data.datasets?.forEach((dataset) => {
      values.push(dataset.data);
    });
    let total = 0;
    values.forEach((value) => {
      const val = value[value.length - (offset + 1)];
      if (typeof val !== 'number') return;
      total += value[value.length - (offset + 1)];
    });
    return total.toFixed(2);
  };

  const getCostsTotal = (offset = 0) => {
    if (!data) return;
    const values = [];
    data.datasets?.forEach((dataset) => {
      values.push(dataset.data.map((d) => d * dataset.price));
    });
    let total = 0;
    values.forEach((value) => {
      // current month
      total += value[value.length - (offset + 1)];
    });
    return total.toFixed(4);
  };

  const calculateRelativeToPreviousMonth = () => {
    const currMonthTotal = getUsageTotal();
    const prevMonthTotal = getUsageTotal(1);
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
    const currMonthTotal = getUsageTotal();
    const prevMonthTotal = getUsageTotal(1);

    if (!currMonthTotal || !prevMonthTotal) return;
    return <span className="invoices-value__sub">{` ${calculateRelativeToPreviousMonth()}`}</span>;
  };

  const renderSKUWarnings = () => {
    if (!skuUnitsWarnings.length) return;
    return (
      <div className="invoices-warnings">
        <ul>
          {skuUnitsWarnings.map((warning) => {
            return (
              <li key={warning} className="invoices-warning">
                {warning}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderInfo = () => {
    return (
      <div className="invoices-info">
        <span className="invoices-info__header">Info</span>
        <div className="invoices-info__text">
          <p>
            The chart above shows the usage for the current and previous month. The costs are
            calculated based on the SKU definitions. If the unit or pice is unavailable, the usage
            will be used instead of the final cost.
          </p>
        </div>
      </div>
    );
  };

  const renderUsage = () => {
    return parseFloat(getUsageTotal()) > 0 ? (
      <div className="invoices-value__costs-item">
        <span className="invoices-value__costs-header">Usage: </span>
        <span className="invoices-value__costs-value">{` ${getUsageTotal()}`}</span>
      </div>
    ) : (
      <div className="invoices-value__costs-item">
        <span className="invoices-value__costs-header">Usage: </span>
        <span className="invoices-value__costs-value">{` 0`}</span>
      </div>
    );
  };

  const renderCosts = () => {
    if (skuUnitsWarnings.length) return;
    const total = getCostsTotal();
    if (parseFloat(total) <= 0) return;
    return (
      <div className="invoices-value__costs-item">
        <span className="invoices-value__costs-header">Costs: </span>
        <span className="invoices-value__costs-value">{` £${total}`}</span>
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Members</h2>
        </div>
        <div className="header-right">
          <img alt="Members" src={memberGroupIcon} />
          <div className="header-right-text">
            <span className="header-right-title">Members area</span> is dedicated to managing the
            members associated to this workspace.
          </div>
        </div>
      </div>
    );
  };

  const thisMonthUsage = getUsageTotal();
  const prevMonthUsage = getUsageTotal();

  return (
    <div className="invoices content-page">
      {renderHeader()}
      <div className="invoices-container">
        {data && renderSKUWarnings()}
        {renderInfo()}
        {data && thisMonthUsage && prevMonthUsage && <Bar data={data} options={options} />}
        <div className="invoices-value-container">
          <div>
            <span className="invoices-value__header">Current monthly</span>
            <div className="invoices-value__costs">
              {renderUsage()}
              {renderCosts()}
            </div>
          </div>
          {renderComparison()}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
