/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useRef, useState } from 'react';

import './styles.scss';

import type { Catalog } from 'stac-js';

import link from '@/assets/icons/link.svg';
import { Button } from '@/components/Button/Button';
import Modal from '@/components/Modal/Modal';
import { useDataLoader } from '@/hooks/useDataLoader';
import { useWorkspace } from '@/hooks/useWorkspace';

import Selector from './components/Selector/Selector';
import DataLoaderTutorial from './components/Tutorial/DataLoaderTutorial';
import AccessPolicyDescription from './descriptions/AccessPolicyDescription';
import { catalogPlaceholder } from './placeholders/catalogPlaceholder';

const DataLoader = () => {
  const { activeWorkspace } = useWorkspace();
  const {
    files,
    setFiles,
    fileName,
    setFileName,
    state,
    setState,
    message,
    setMessage,
    running,
    setRunning,
    validationErrors,
    setValidationErrors,
    fileType,
    setFileType,
    selectedCollection,
    selectedCatalog,
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
        setCatalogues(json.catalogs);
      }
    };
    getCatalogues();
  }, [activeWorkspace.name]);

  const renderHeader = () => {
    return (
      <div className="header">
        <div className="header-left">
          <h2>Data Loader</h2>
        </div>
        <div className="header-right">
          <img alt="Members" src={link} />
          <div className="header-right-text">
            <span className="header-right-title">Data Loader</span> allows you to validate, upload
            and harvest STAC files directly into your workspace.
            <span
              className="header-right-title data-loader-tutorial-text"
              onClick={() => setTutorialModal(true)}
            >
              How to use the data loader
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderFileSelector = () => {
    if (!selectedCollection && fileType === 'stac') return;
    return (
      <div className="data-loader__file">
        {fileType === 'stac' ? (
          <h2>
            Please select all STAC items you wish you load into {selectedCatalog.id}/
            {selectedCollection.id}
          </h2>
        ) : (
          <h2>Please select your Access Policy file</h2>
        )}
        <input
          ref={fileInputRef}
          accept=".json"
          multiple={fileType === 'stac'}
          type="file"
          onChange={(e) => {
            setFiles(e.target.files);
            setFileName(e.target.files[0].name);
          }}
        />
      </div>
    );
  };

  const renderDropdown = () => {
    return (
      <div className="data-loader__dropdown">
        <span>Upload type</span>
        <select
          className="data-loader__select"
          value={fileType}
          onChange={(e) => {
            setFiles(null);
            setFileName('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            setState('validate');
            setMessage('');
            setValidationErrors([]);
            setFileType(e.target.value);
          }}
        >
          <option value={'stac'}>STAC</option>
          <option value={'access-policy'}>Access Policy</option>
        </select>
      </div>
    );
  };

  const renderDescription = () => {
    return <AccessPolicyDescription />;
  };

  const renderCatalogCollectionSelector = () => {
    if (fileType !== 'stac') return;
    if (!catalogues.length) {
      setMessage('No catalogs associated to this workspace');
      return;
    }
    return <Selector catalogues={catalogues} />;
  };

  const renderFileNameField = () => {
    return (
      <div className="data-loader__input">
        <label htmlFor="data-loader-file-name">File name</label>
        <input
          disabled={fileType === 'access-policy'}
          id="data-loader-file-name"
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
    );
  };

  const validateFileName = () => {
    let valid = true;
    // access-policy.json would cause the backend to break
    if (fileName.includes('access-policy')) {
      setMessage('File name cannot include access-policy');
      valid = false;
    }
    if (!fileName) {
      setMessage('File name cannot be empty');
      valid = false;
    }
    return valid;
  };

  const renderButton = () => {
    const buttonData = {
      validate: {
        method: validate,
        text: 'Validate',
      },
      upload: {
        method: upload,
        text: 'Upload',
      },
      harvest: {
        method: harvest,
        text: 'Load',
      },
    };

    return (
      <Button disabled={running} onClick={buttonData[state].method}>
        {running ? 'Running' : buttonData[state].text}
      </Button>
    );
  };

  const validate = async () => {
    if (!files) {
      setMessage('Please select at least one file before running validation');
      return;
    }

    setRunning(true);
    setMessage('Validating file');
    try {
      if (fileType === 'access-policy') validateAccessPolicy();
      if (fileType === 'stac') {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          await validateSTAC(file);
        }
      }
      setMessage('File(s) successfully validated');
      setState('upload');
    } catch (error) {
      console.error(error);
    }
    setRunning(false);
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
      const res = await fetch(`https://dev.eodatahub.org.uk/api/validate-stac`, {
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
      if (fileType === 'stac') {
        const valid = validateFileName();
        if (!valid) return;
      }
      setRunning(true);
      setMessage('Uploading file');

      try {
        const stacContent = await file.text();
        const stacObject = JSON.parse(stacContent);

        const parentLinkObject = stacObject.links.filter((link) => link.rel === 'parent')[0];
        if (parentLinkObject) {
          parentLinkObject.href = `catalogs/${selectedCatalog.id}/collections/${selectedCollection.id}`;

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

        const body = {
          fileContent: JSON.stringify(stacObject),
          fileName,
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
      }
    }
    setRunning(false);
  };

  const harvest = async () => {
    setRunning(true);
    setMessage('STAC file harvest in progress, check back later');
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
        <div className="data-loader">
          {message && <div className="data-loader__message">{message}</div>}
          {renderDropdown()}
          {fileType === 'access-policy' && renderDescription()}
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
          {state === 'upload' ? renderFileNameField() : null}
          {renderButton()}
        </div>
      </div>
    </>
  );
};

export default DataLoader;
