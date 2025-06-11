/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, createContext, useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';
import type { Catalog, Collection } from 'stac-js';

import { useWorkspace } from '@/hooks/useWorkspace';
import { logsPlaceholder } from '@/pages/Publisher/components/Logs/logsPlaceholder';
import { Log, LogResponse } from '@/pages/Publisher/components/Logs/types';
import { displayUTCTime } from '@/utils/time';

export type PublisherContextType = {
  files: FileList;
  setFiles: (value: FileList) => void;

  fileName: string;
  setFileName: (value: string) => void;

  state: State;
  setState: (value: State) => void;

  setMessage: (value: string) => void;

  running: boolean;
  setRunning: (value: boolean) => void;

  validationErrors: string[];
  setValidationErrors: (value: string[]) => void;

  fileType: string;
  setFileType: (value: string) => void;

  selectedCatalog: Catalog;
  setSelectedCatalog: (value: Catalog) => void;

  collections: Collection[];
  setCollections: (value: Collection[]) => void;

  selectedCollection: Collection;
  setSelectedCollection: (value: Collection) => void;

  pageState: string;
  setPageState: (value: 'data-loader' | 'logs') => void;

  pollingRef: React.MutableRefObject<() => void>;
  logs: Log[];
  logsError: string;
};

type PublisherProviderProps = {
  initialState?: Partial<PublisherContextType>;
  children: ReactNode;
};
type State = 'validate' | 'upload' | 'harvest' | 'view';

export const PublisherContext = createContext<PublisherContextType | null>(null);
PublisherContext.displayName = 'PublisherContext';

export const PublisherProvider = ({ initialState = {}, children }: PublisherProviderProps) => {
  const { activeWorkspace } = useWorkspace();

  const [files, setFiles] = useState<FileList>();
  const [fileName, setFileName] = useState<string>('');
  const [state, setState] = useState<State>('validate');
  const [running, setRunning] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [fileType, setFileType] = useState<string>('stac');
  const [selectedCatalog, setSelectedCatalog] = useState<Catalog>();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection>();
  const [pageState, setPageState] = useState<'data-loader' | 'logs'>('data-loader');

  const defaultLog = [
    {
      datetime: displayUTCTime(new Date().toISOString()),
      message: 'No logs to display',
      level: 'Error',
    },
  ];

  const [logs, setLogs] = useState<Log[]>(defaultLog);
  const [logsError, setLogsError] = useState<string>();

  const pollingRef = useRef(null);

  const getLogs = async () => {
    if (import.meta.env.VITE_WORKSPACE_LOCAL) {
      setLogs(logsPlaceholder.messages);
      return;
    }

    const res = await fetch(`/workspaces/${activeWorkspace.name}/harvest_logs`, {
      method: 'POST',
    });

    if (!res.ok) {
      setLogsError('Failed to get Logs');
      return;
    }

    const json: LogResponse = await res.json();

    let messages = defaultLog;

    if (json.messages.length > 0) {
      messages = json.messages;
    }

    setLogs(messages);
  };

  useEffect(() => {
//     if (pageState !== 'logs') return;
    if (pollingRef.current) return;
    // Poll  the endpoint every 10 seconds
    pollingRef.current = setInterval(() => {
      getLogs();
    }, 10000);
  }, [pageState]);

  useEffect(() => {
    if (!activeWorkspace) return;
    getLogs();
  }, [activeWorkspace]);

  const setMessage = (message: string) => {
    toast(message);
  };

  return (
    <PublisherContext.Provider
      value={{
        files,
        setFiles,
        fileName,
        setFileName,
        state,
        setState,
        setMessage,
        running,
        setRunning,
        validationErrors,
        setValidationErrors,
        fileType,
        setFileType,
        selectedCatalog,
        setSelectedCatalog,
        collections,
        setCollections,
        selectedCollection,
        setSelectedCollection,
        pageState,
        setPageState,
        pollingRef,
        logs,
        logsError,
        ...initialState,
      }}
    >
      {children}
    </PublisherContext.Provider>
  );
};
