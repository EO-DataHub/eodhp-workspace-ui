export type InvoiceData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    unit: string;
    price: number;
  }[];
};

export type Price = {
  uuid: string;
  sku: string;
  valid_from: string;
  valid_until: string | null;
  price: number;
};
