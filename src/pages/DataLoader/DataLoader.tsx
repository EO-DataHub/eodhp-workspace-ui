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
import { catalogPlaceholder } from './placeholders/catalogPlaceholder';

const DataLoader = () => {
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
          <h2>STAC Metadata Loader</h2>
        </div>
        <div className="header-right">
          <img alt="Members" src={link} />
          <div className="header-right-text">
            <span className="header-right-title">STAC Metadata Loader</span> allows you to validate,
            upload and harvest STAC files directly into your workspace.
            <span
              className="header-right-title data-loader-tutorial-text"
              onClick={() => setTutorialModal(true)}
            >
              How to use the STAC Metadata Loader
            </span>
            . See <a href="/docs/documentation/data-publishing/">documentation</a> for more
            information.
          </div>
        </div>
      </div>
    );
  };

  const renderFileSelector = () => {
    if (!selectedCollection) return;
    return (
      <div className="data-loader__file">
        <h2>
          Please select all STAC items you wish you load into {selectedCatalog.id}/
          {selectedCollection.id}
        </h2>
        <input
          ref={fileInputRef}
          accept=".json"
          multiple={true}
          type="file"
          onChange={(e) => {
            setFiles(e.target.files);
            setFileName(e.target.files[0].name);
          }}
        />
      </div>
    );
  };

  const renderCatalogCollectionSelector = () => {
    if (!catalogues.length) {
      return;
    }
    return <Selector catalogues={catalogues} />;
  };

  const renderButton = () => {
    return (
      <Button className="data-loader-run-button" disabled={running} onClick={runAll}>
        {running ? 'Running…' : 'Submit'}
      </Button>
    );
  };

  const validateSTAC = async (file: File) => {
    const stacContent = await file.text();
    let stac;
    try {
      stac = JSON.parse(stacContent);
      setMessage('File validation complete');
    } catch (e) {
      setMessage(
        `Validation indicates file ${file.name} not fully compliant. Attempting to proceed with file upload`,
      );
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
      setMessage(
        `Validation indicates file ${file.name} not fully compliant. Proceeding with file upload`,
      );
      if (!data.content) {
        setValidationErrors([data.message]);
        throw new Error();
      }
      setValidationErrors(errors);
      throw new Error();
    } else {
      if (data.type !== 'ITEM') {
        setMessage(`${file.name} is of type ${data.type} it must be a STAC Item`);
        throw new Error();
      }
      setValidationErrors(errors);
    }
  };

  const upload = async () => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setRunning(true);

      try {
        const stacContent = await file.text();
        const stacObject = JSON.parse(stacContent);

        const parentLinkObject = stacObject.links.filter((link) => link.rel === 'parent')[0];
        if (parentLinkObject) {
          const selfLink = selectedCatalog.links.filter((link) => {
            return link.rel === 'self';
          })[0];
          const selectedId = selfLink.href.split(`${activeWorkspace.name}/catalogs/`)[1];

          if (!selectedId.includes('/')) {
            parentLinkObject.href = `catalogs/${selectedCatalog.id}/collections/${selectedCollection.id}`;
          } else {
            parentLinkObject.href = `catalogs/${selectedId}/collections/${selectedCollection.id}`;
          }

          const parentLinkIndex = stacObject.links.findIndex((link) => link.rel === 'parent');
          stacObject.links[parentLinkIndex] = parentLinkObject;
        } else {
          stacObject.links.push({
            rel: 'parent',
            href: `catalogs/${selectedCatalog.id}/collections/${selectedCollection.id}`,
            type: 'application/json',
          });
        }

        const selfLinkObject = stacObject.links.filter((link) => link.rel === 'self')[0];
        if (!selfLinkObject) {
          stacObject.links.push({
            rel: 'self',
            href: 'catalogs/${selectedCatalog.id}/collections/${selectedCollection.id}',
            type: 'application/json',
          });
        }

        stacObject.collection = `${selectedCollection.id}`;

        const _fileName = `${generateRandomString()}.json`;

        const body = {
          fileContent: JSON.stringify(stacObject),
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
        throw new Error();
      }
    }
    setRunning(false);
  };

  const harvest = async () => {
    setRunning(true);
    setMessage(
      'Metadata upload in progress. There may be a delay while your data is processed. Check the Logs tab to view progress and look for the Updated Feature entry',
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
    setMessage('Starting…');
    try {
      for (let i = 0; i < files.length; i++) {
        await validateSTAC(files[i]);
      }
    } catch (err) {
      // validation setMessage internally if it fails
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
          Metadata Loader
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
        {renderCatalogCollectionSelector()}
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
        {state === 'view' && (
          <Button
            className="data-loader-view-button"
            onClick={() => {
              view();
            }}
          >
            View data
          </Button>
        )}
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
        {renderTabs()}
        {renderContent()}
        <ToastContainer hideProgressBar position="bottom-left" theme="light" />
      </div>
    </>
  );
};

export default DataLoader;
