/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';

import { LazyLog } from 'react-lazylog';
import { ToastContainer, toast } from 'react-toastify';

import LogIcon from '@/assets/icons/logs.svg';
import Refresh from '@/assets/icons/refresh.svg';
import { useWorkspace } from '@/hooks/useWorkspace';

import { logsPlaceholder } from './logsPlaceholder';
import { Log, LogResponse } from './types';

const Logs = () => {
  const { activeWorkspace } = useWorkspace();

  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string>();
  const [gettingLogs, setGettingLogs] = useState<boolean>(false);

  const getLogs = async () => {
    if (import.meta.env.VITE_WORKSPACE_LOCAL) {
      setLogs(logsPlaceholder.messages);
      return;
    }

    const res = await fetch(`/workspaces/${activeWorkspace.name}/harvest_logs`, {
      method: 'POST',
    });

    if (!res.ok) {
      setError('Failed to get Logs');
      return;
    }

    const json: LogResponse = await res.json();
    toast('Logs successfully retrieved');

    let messages = [
      { datetime: new Date().toDateString(), message: 'No logs to display', level: 'Error' },
    ];
    if (json?.messages.length > 0) {
      messages = json.messages;
    }

    setLogs(messages);
  };

  useEffect(() => {
    getLogs();
  }, [activeWorkspace.name]);

  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Logs</h2>
        </div>
        <div className="header-right">
          <img alt="Logs" className="logs__header-img" src={LogIcon} />
          <div className="header-right-text">
            <span className="header-right-title">Logs</span> contains recent log messages produced
            for STAC files harvested through the{' '}
            <span className="header-right-title">Data Loader</span>
          </div>
        </div>
      </div>
    );
  };

  const renderError = () => {
    return <div className="logs__error">{error}</div>;
  };

  const calculateContainerHeight = () => {
    const container = document.getElementsByClassName('workspace-content')[0];
    if (!container) return 0;
    const containerHeight = container.clientHeight;
    const newHeight = Math.min(containerHeight - 150, 400);
    return `${newHeight}`;
  };
  const heightRef = useRef(calculateContainerHeight());

  const renderLogs = () => {
    return (
      <LazyLog
        enableSearch
        follow
        selectableLines
        extraLines={1}
        height={heightRef.current}
        overscanRowCount={100}
        text={getText()}
      />
    );
  };
  const renderButtons = () => {
    return (
      <div className="logs__buttons">
        <img
          className="logs__buttons-sort"
          src={Refresh}
          onClick={async () => {
            if (gettingLogs) return;
            setGettingLogs(true);
            toast('Refreshing logs');
            await getLogs();
            setGettingLogs(false);
          }}
        />
      </div>
    );
  };

  const getText = () => {
    const text = logs.map((log) => {
      return `[${log.datetime}] ${log.message}`;
    });
    return text.join('\n');
  };

  return (
    <div className="content-page logs">
      {renderHeader()}
      {error && renderError()}
      {renderButtons()}
      {renderLogs()}
      <ToastContainer hideProgressBar position="bottom-left" theme="light" />
    </div>
  );
};

export default Logs;
