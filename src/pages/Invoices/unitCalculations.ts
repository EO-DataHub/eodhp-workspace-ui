import { SKU } from '@/context/WorkspaceContext/types';

const cumulative = (sku: SKU) => {
  return sku.quantity;
};

export const calculationMap: { [key: string]: (sku: SKU) => number } = {
  cumulative,
};
