export type LogResponse = {
  count: number;
  messages: Log[];
};

export type Log = {
  datetime: string;
  message: string;
  level: string;
};
