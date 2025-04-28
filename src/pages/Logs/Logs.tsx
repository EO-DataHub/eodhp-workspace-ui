/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import './styles.scss';

import { LazyLog } from 'react-lazylog';

import Sort from '@/assets/icons/sort.svg';
import { useWorkspace } from '@/hooks/useWorkspace';

import { logsPlaceholder } from './logsPlaceholder';
import { Log, LogResponse } from './types';

const Logs = () => {
  const { activeWorkspace } = useWorkspace();

  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string>();
  const [ascend, setAscend] = useState<boolean>(true);

  useEffect(() => {
    const getLogs = async () => {
      const res = await fetch(`/workspaces/${activeWorkspace.name}/harvest_logs`, {
        method: 'POST',
      });

      if (!res.ok) {
        setError('Failed to get Logs');
        return;
      }

      const json: LogResponse = await res.json();

      setLogs(json.messages);
    };

    if (import.meta.env.VITE_WORKSPACE_LOCAL) {
      setLogs(logsPlaceholder.messages);
      return;
    }

    getLogs();
  }, [activeWorkspace.name]);

  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Logs</h2>
        </div>
      </div>
    );
  };

  const renderError = () => {
    return <div className="logs__error">{error}</div>;
  };

  const renderButtons = () => {
    return (
      <div className="logs__buttons">
        <img
          className="logs__buttons-sort"
          src={Sort}
          onClick={() => {
            setAscend(!ascend);
          }}
        />
      </div>
    );
  };

  const renderLogs = () => {
    return (
      <LazyLog
        ref={{
          current: '[Circular]',
        }}
        enableSearch
        follow
        selectableLines
        extraLines={1}
        height="300"
        overscanRowCount={100}
        text={getText()}
      />
    );
  };

  const getText = () => {
    let text;

    if (ascend) {
      text = logs.map((log) => {
        return `[${log.datetime}] ${log.message}`;
      });
    } else {
      text = logs.reverse().map((log) => {
        return `[${log.datetime}] ${log.message}`;
      });
    }
    text = text.join('\n');
    return text;
  };

  return (
    <div className="content-page logs">
      {renderHeader()}
      {error && renderError()}
      {renderButtons()}
      {renderLogs()}
    </div>
  );
};

export default Logs;
