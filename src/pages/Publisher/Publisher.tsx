/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useRef } from 'react';

import './styles.scss';

import { ToastContainer } from 'react-toastify';

import link from '@/assets/icons/link.svg';
import { Button } from '@/components/Button/Button';
import { useDataLoader } from '@/hooks/useDataLoader';
import { useWorkspace } from '@/hooks/useWorkspace';

import Logs from './components/Logs/Logs';
import AccessPolicyDescription from './descriptions/AccessPolicyDescription';

const Publisher = () => {
  const { activeWorkspace } = useWorkspace();
  const {
    files,
    setFiles,
    setFileName,
    setState,
    setMessage,
    running,
    setRunning,
    validationErrors,
    setValidationErrors,
    pageState,
    setPageState,
  } = useDataLoader();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Publisher</h2>
        </div>
        <div className="header-right">
          <img alt="Members" src={link} />
          <div className="header-right-text">
            <span className="header-right-title">Publisher</span> allows you to publish your
            workflows and data into the EODH public catalogue by setting an Access Policy. This
            means any EODH users can search and find your workflow(s) and/or data. See{' '}
            <a href="/docs/documentation/data-publishing/">documentation</a> for more information.
          </div>
        </div>
      </div>
    );
  };

  const renderFileSelector = () => {
    return (
      <div className="data-loader__file">
        <h2>Please select your Access Policy file</h2>
        <input
          ref={fileInputRef}
          accept=".json"
          type="file"
          onChange={(e) => {
            setFiles(e.target.files);
            setFileName(e.target.files[0].name);
          }}
        />
      </div>
    );
  };

  const renderDescription = () => {
    return <AccessPolicyDescription />;
  };

  const renderButton = () => {
    return (
      <Button className="data-loader-run-button" disabled={running} onClick={runAll}>
        {running ? 'Running…' : 'Submit'}
      </Button>
    );
  };

  const validateAccessPolicy = async () => {
    if (!files) {
      setMessage('Please select a file before running validation');
      return;
    }

    setRunning(true);
    try {
      const text = await files[0].text();
      JSON.parse(text);
      setState('upload');
      setFileName('access-policy.json');
      setMessage(`Validation successful`);
    } catch {
      setMessage(`Validation indicates file contains invalid JSON. Proceeding with file upload`);
    }
    setRunning(false);
  };

  const upload = async () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setRunning(true);

      try {
        const fileContent = await file.text();
        const fileObject = JSON.parse(fileContent);

        const _fileName = 'access-policy.json';

        const body = {
          fileContent: JSON.stringify(fileObject),
          fileName: _fileName,
        };

        const res = await fetch(`/api/workspaces/${activeWorkspace.name}/data-loader`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          setMessage(`Failed to upload ${file.name} to s3`);
          throw new Error();
        }

        setState('harvest');
      } catch (error) {
        console.error(error);
        setMessage('File not uploaded');
      }
    }
    setRunning(false);
  };

  const harvest = async () => {
    setRunning(true);
    setMessage(
      'Access policy update in progress. There may be a delay while your data is processed. Check the Logs tab to view progress and look for entries relating to access policies',
    );
    try {
      const res = await fetch(`/workspaces/${activeWorkspace.name}/harvest`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to load data');
      }
    } catch (error) {
      setMessage(error);
    }
    setRunning(false);
    setState('validate');

    setValidationErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runAll = async () => {
    // (1) Validate step
    if (!files) {
      setMessage('Please select at least one file before running validation');
      return;
    }

    setRunning(true);
    setMessage('Starting…');
    try {
      await validateAccessPolicy();
    } catch (err) {
      // validation setMessage internally if it fails
      setRunning(false);
      return;
    }

    // (2) Upload step
    try {
      await upload();
    } catch (err) {
      // upload already logs and calls setMessage on error
      setRunning(false);
      return;
    }

    // (3) Harvest step
    try {
      await harvest();
    } catch (err) {
      // harvest already logs and calls setMessage if it fails
      setRunning(false);
      return;
    }

    setRunning(false);
  };

  const renderTabs = () => {
    return (
      <div className="data-loader-tabs">
        <div
          className={`data-loader-tabs__tab ${pageState === 'data-loader' ? 'active' : null}`}
          onClick={() => setPageState('data-loader')}
        >
          Publisher
        </div>
        <div
          className={`data-loader-tabs__tab ${pageState === 'logs' ? 'active' : null}`}
          onClick={() => setPageState('logs')}
        >
          Logs
        </div>
      </div>
    );
  };

  const renderContent = () => {
    const componentMap = {
      'data-loader': renderDataLoader,
      logs: renderLogs,
    };

    return componentMap[pageState]();
  };

  const renderLogs = () => {
    return <Logs />;
  };

  const renderDataLoader = () => {
    return (
      <div className="data-loader">
        {renderDescription()}
        {renderFileSelector()}
        {validationErrors.length > 0 && (
          <ul className="data-loader__errors">
            <h3>Validation warnings</h3>
            {validationErrors.map((error) => {
              return (
                <li key={error} className="data-loader__errors-error">
                  {error}
                </li>
              );
            })}
          </ul>
        )}
        {renderButton()}
      </div>
    );
  };

  return (
    <>
      <div className="content-page">
        {renderHeader()}
        {renderTabs()}
        {renderContent()}
        <ToastContainer hideProgressBar position="bottom-left" theme="light" />
      </div>
    </>
  );
};

export default Publisher;
