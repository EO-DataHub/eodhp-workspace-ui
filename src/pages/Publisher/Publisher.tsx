/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';

import './styles.scss';

import { ToastContainer } from 'react-toastify';
import type { Catalog } from 'stac-js';

import link from '@/assets/icons/link.svg';
import { Button } from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useDataLoader } from '@/hooks/useDataLoader';
import { useWorkspace } from '@/hooks/useWorkspace';

import Logs from './components/Logs/Logs';
import Selector from './components/Selector/Selector';
import DataLoaderTutorial from './components/Tutorial/DataLoaderTutorial';
import AccessPolicyDescription from './descriptions/AccessPolicyDescription';
import { catalogPlaceholder } from './placeholders/catalogPlaceholder';

const Publisher = () => {
  const { activeWorkspace } = useWorkspace();
  const {
    files,
    setFiles,
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
    selectedCollection,
    selectedCatalog,
    pageState,
    setPageState,
  } = useDataLoader();

  const [tutorialModal, setTutorialModal] = useState<boolean>(false);

  const [catalogues, setCatalogues] = useState<Catalog[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getCatalogues = async () => {
      if (import.meta.env.VITE_WORKSPACE_LOCAL) {
        setCatalogues(catalogPlaceholder.catalogs);
      } else {
        const res = await fetch(
          `/api/catalogue/stac/catalogs/user/catalogs/${activeWorkspace.name}/catalogs`,
        );
        const json = await res.json();

        const filteredCatalogs = json.catalogs.filter(
          (catalog) => catalog.id !== 'processing-results',
        );
        setCatalogues(filteredCatalogs);
      }
    };
    getCatalogues();
  }, [activeWorkspace.name]);

  const generateRandomString = (length = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Publisher</h2>
        </div>
        <div className="header-right">
          <img alt="Members" src={link} />
          <div className="header-right-text">
            <span className="header-right-title">Publisher</span> allows you to publish your workflows and data into
            the EODH public catalogue by setting an Access Policy. This means any EODH users can search and find your
            workflow(s) and/or data.

          </div>
        </div>
      </div>
    );
  };

  const renderFileSelector = () => {
    if (!selectedCollection && fileType === 'stac') return;
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

  const renderCatalogCollectionSelector = () => {

  };

  const renderButton = () => {
    return (
      <Button className="data-loader-run-button" disabled={running} onClick={runAll}>
        {running ? 'Running…' : 'Run'}
      </Button>
    );
  };

  const validateAccessPolicy = async () => {
    if (!files) {
      setMessage('Please select a file before running validation');
      return;
    }

    setRunning(true);
    setMessage('Validating Access Policy');
    try {
      const text = await files[0].text();
      JSON.parse(text);
      setMessage('File successfully validated');
      setState('upload');
      setFileName('access-policy.json');
    } catch {
      setMessage('Invalid JSON');
    }
    setRunning(false);
  };

  const validateSTAC = async (file: File) => {
    const stacContent = await file.text();
    let stac;
    try {
      stac = JSON.parse(stacContent);
    } catch (e) {
      setMessage(`❌ Invalid JSON format in file ${file.name}`);
      throw new Error();
    }

    let data;

    try {
      const res = await fetch(`/api/validate-stac`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({
          content: stac,
        }),
      });
      const dataAndCode = await res.json();
      data = dataAndCode[0];
    } catch (error) {
      setMessage('Failed to send request');
      throw new Error();
    }

    const errors = [];
    data.content.forEach((error) => {
      if (Array.isArray(error)) {
        error.forEach((e) => errors.push(e));
      } else {
        errors.push(error);
      }
    });

    if (data.status === 'error') {
      if (!data.content) {
        setMessage(`❌ Failed to validate STAC in file ${file.name}`);
        setValidationErrors([data.message]);
        throw new Error();
      }
      setMessage(`❌ Failed to validate STAC in file ${file.name}`);
      setValidationErrors(errors);
      throw new Error();
    } else {
      if (data.type !== 'ITEM') {
        setMessage(`❌ ${file.name} is of type ${data.type} it must be a STAC Item`);
        throw new Error();
      }
      setMessage('✅ STAC item is valid!');
      setValidationErrors(errors);
    }
  };

  const upload = async () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setRunning(true);
      setMessage('Uploading file');

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
          setMessage('File successfully uploaded');
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
      'In progress... There may be a slight delay while your data is processed. In the meantime, please use the buttons below to view available data.',
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

  const view = () => {
    let collectionSelf;

    if (selectedCollection) {
      collectionSelf = selectedCollection.links.filter((link) => {
        return link.rel === 'self';
      })[0];
    }

    window.open(`${collectionSelf.href}/items`, '_blank');
    setState('validate');
  };

  const runAll = async () => {
    // (1) Validate step
    if (!files) {
      setMessage('Please select at least one file before running validation');
      return;
    }

    setRunning(true);
    setMessage('Starting validation…');
    try {
        await validateAccessPolicy();
    } catch (err) {
      // validation setMessage internally if it fails
      setRunning(false);
      return;
    }

    // (2) Upload step
    setMessage('Validation passed. Uploading file(s)…');
    try {
      await upload();
    } catch (err) {
      // upload already logs and calls setMessage on error
      setRunning(false);
      return;
    }

    // (3) Harvest step
    setMessage('Upload succeeded. Harvesting data…');
    try {
      await harvest();
    } catch (err) {
      // harvest already logs and calls setMessage if it fails
      setRunning(false);
      return;
    }

    setRunning(false);
    setMessage('Done.');
  };

  const renderTabs = () => {
    return (
      <div className="data-loader-tabs">
        <div
          className={`data-loader-tabs__tab ${pageState === 'data-loader' ? 'active' : null}`}
          onClick={() => setPageState('data-loader')}
        >
          Metadata Loader
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
      {tutorialModal && (
        <Modal
          hideSubmit
          cancelText="Close"
          content={<DataLoaderTutorial />}
          onCancel={() => {
            setTutorialModal(false);
          }}
          onSubmit={() => {
            setTutorialModal(false);
          }}
        />
      )}
      <div className="content-page">
        {renderHeader()}

        {renderContent()}
        <ToastContainer hideProgressBar position="bottom-left" theme="light" />
      </div>
    </>
  );
};

export default Publisher;
