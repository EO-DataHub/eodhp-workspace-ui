/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-constant-condition */
import { ReactNode, createContext, useEffect, useState } from 'react';

import { useWorkspace } from '@/hooks/useWorkspace';
import { InvoiceData, Price } from '@/pages/Invoices/types';

import {
  pricesPlaceholder,
  skuDayPlaceholder,
  skuMonthPlaceholder,
  testSkuDefinition,
} from '../WorkspaceContext/placeholder';
import { SKU, SKUDefinition } from '../WorkspaceContext/types';

export type InvoicesContextType = {
  pageState: State;
  setPageState: (value: State) => void;

  breakdown: Breakdown;
  setBreakdown: (breakdown: Breakdown) => void;

  skus: SKU[];
  data: InvoiceData;
  skuUnitsWarnings: string[];
  skuUnits: { [key: string]: string };
  prices: Price[];
  calculateRelativeToPreviousMonth: () => string;
  getCostsTotal: (offset?: number) => string;
  getUsageTotal: (offset?: number) => string;
  getSKUPrice: (skuName: string) => Price;
  getSKUUnit: (skuName: string) => string;
  pricingValid: boolean;
  setPricingValid: (valid: boolean) => void;
  monthsShort: string[];
  getMonthInt: (offset?: number, date?: Date) => number;
  selectedMonth: number;
  setSelectedMonth: (monthInt: number) => void;
};

type InvoicesProviderProps = {
  initialState?: Partial<InvoicesContextType>;
  children: ReactNode;
};
type State = 'chart' | 'table';
type Breakdown = 'month' | 'day' | string;

export const InvoicesContext = createContext<InvoicesContextType | null>(null);
InvoicesContext.displayName = 'InvoicesContext';

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

const skuUnits: { [key: string]: string } = {};
const skuUnitsWarnings: string[] = [];

export const InvoicesProvider = ({ initialState = {}, children }: InvoicesProviderProps) => {
  const [pageState, setPageState] = useState<State>('table');
  const [breakdown, setBreakdown] = useState<Breakdown>('month');
  const [skus, setSKUs] = useState<SKU[]>([]);

  const { activeWorkspace } = useWorkspace();
  const [months, setMonths] = useState<number[]>([]);
  const [data, setData] = useState<InvoiceData>();
  const [prices, setPrices] = useState<Price[]>([]);
  const [pricingValid, setPricingValid] = useState<boolean>(false);

  const getMonthInt = (offset = 0, date = new Date()) => {
    date.setMonth(date.getMonth() + offset);
    return parseInt(date.toLocaleString('en-US', { month: '2-digit' }));
  };

  const [selectedMonth, setSelectedMonth] = useState<number>(getMonthInt(-1));

  // Attempt to get SKUs from workspace services. Will use placeholder data locally.
  // SKU stands for stock-keeping unit defined https://github.com/EO-DataHub/accounting-service/blob/9583a1217ca6be898b700bd9a9cae59a51fca727/accounting_service/models.py#L64
  useEffect(() => {
    if (!activeWorkspace) return;
    const fetchAllSkus = async () => {
      if (import.meta.env.VITE_WORKSPACE_LOCAL) {
        if (breakdown === 'month') return skuMonthPlaceholder;
        if (breakdown === 'day') return skuDayPlaceholder;
      }

      const all: SKU[] = [];
      let after: string | undefined = undefined;
      const limit = 1000;

      while (true) {
        const params = new URLSearchParams({ limit: String(limit) });
        if (breakdown) params.set('time-aggregation', breakdown);
        if (after) params.set('after', after);

        const res = await fetch(
          `/api/workspaces/${activeWorkspace.name}/accounting/usage-data?${params.toString()}`,
        );
        if (!res.ok) {
          throw new Error('Error fetching usage data');
        }
        const batch: SKU[] = await res.json();
        if (batch.length === 0) break;
        all.push(...batch);
        after = batch[batch.length - 1].uuid;
      }

      return all;
    };

    fetchAllSkus()
      .then(setSKUs)
      .catch((err) => {
        console.error(err);
      });
  }, [activeWorkspace, breakdown]);

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
        const _prices: Price[] = await res.json();
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

  const getSKUUnit = (skuName: string): string => {
    return skuUnits[skuName];
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

  return (
    <InvoicesContext.Provider
      value={{
        pageState,
        setPageState,
        data,
        skuUnitsWarnings,
        skuUnits,
        prices,
        calculateRelativeToPreviousMonth,
        getCostsTotal,
        getUsageTotal,
        getSKUPrice,
        skus,
        breakdown,
        setBreakdown,
        getSKUUnit,
        pricingValid,
        setPricingValid,
        monthsShort,
        getMonthInt,
        selectedMonth,
        setSelectedMonth,
        ...initialState,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
};
