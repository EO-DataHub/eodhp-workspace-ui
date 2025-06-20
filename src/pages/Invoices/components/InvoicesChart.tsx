import React from 'react';

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

import { useInvoices } from '@/hooks/useInvoices';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Usage',
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

const InvoicesChart = () => {
  const { data } = useInvoices();

  const renderInfo = () => {
    return (
      <div className="invoices-info">
        <span className="invoices-info__header">Info</span>
        <div className="invoices-info__text">
          <p>
            The chart below shows the usage for the current and previous month. The costs are
            calculated based on the SKU definitions. If the unit or price is unavailable, the usage
            will be used instead of the final cost.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="invoices-container">
      {renderInfo()}
      {data && <Bar data={data} options={options} />}
    </div>
  );
};

export default InvoicesChart;
