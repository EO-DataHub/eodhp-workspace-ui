/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import './styles.scss';

import InvoicesIcon from '@/assets/icons/invoices.svg';
import { useInvoices } from '@/hooks/useInvoices';

import InvoicesChart from './components/InvoicesChart';
import InvoicesTable from './components/InvoicesTable';

const Invoices = () => {
  const {
    pageState,
    setPageState,
    data,
    getUsageTotal,
    getCostsTotal,
    skuUnitsWarnings,
    calculateRelativeToPreviousMonth,
    breakdown,
    setBreakdown,
  } = useInvoices();

  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Invoices</h2>
        </div>
        <div className="header-right">
          <img alt="Members" src={InvoicesIcon} />
          <div className="header-right-text">
            <span className="header-right-title">Invoices area</span> allows you to see a breakdown
            of the current and previous months total usage.
          </div>
        </div>
      </div>
    );
  };

  const renderTabs = () => {
    return (
      <div className="invoices-tabs">
        <div
          className={`invoices-tabs__tab ${pageState === 'chart' ? 'active' : null}`}
          onClick={() => setPageState('chart')}
        >
          Chart
        </div>
        <div
          className={`invoices-tabs__tab ${pageState === 'table' ? 'active' : null}`}
          onClick={() => setPageState('table')}
        >
          Table
        </div>
      </div>
    );
  };

  const renderBreakdown = () => {
    return (
      <div>
        <span>Breakdown</span>
        <select value={breakdown} onChange={(e) => setBreakdown(e.target.value)}>
          <option value="month">Month</option>
          <option value="day">Day</option>
        </select>
      </div>
    );
  };

  const renderContent = () => {
    const componentMap = {
      chart: <InvoicesChart />,
      table: <InvoicesTable />,
    };

    const thisMonthUsage = getUsageTotal();
    const prevMonthUsage = getUsageTotal();
    if (!thisMonthUsage || !prevMonthUsage || !data) return;

    return componentMap[pageState];
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

  return (
    <div className="invoices content-page">
      {renderHeader()}
      {renderTabs()}
      {renderBreakdown()}
      {renderContent()}
      <div className="invoices-value-container">
        {data && renderSKUWarnings()}
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
  );
};

export default Invoices;
