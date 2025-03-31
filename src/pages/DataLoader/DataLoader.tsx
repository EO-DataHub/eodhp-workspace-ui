import React, { useRef, useState } from 'react';

import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

import './styles.scss';

import link from '@/assets/icons/link.svg';
import { Button } from '@/components/Button/Button';
import { useWorkspace } from '@/hooks/useWorkspace';

import basics from './schemas/basics.json';
import datetime from './schemas/datetime.json';
import draft07 from './schemas/draft-07.json';
import feature from './schemas/feature.json';
import geometry from './schemas/geometry.json';
import instrument from './schemas/instrument.json';
import schema from './schemas/item.json';
import licensing from './schemas/licensing.json';
import provider from './schemas/provider.json';

type State = 'validate' | 'upload' | 'harvest';

const DataLoader = () => {
  const { activeWorkspace } = useWorkspace();

  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState<string>('');
  const [state, setState] = useState<State>('validate');
  const [message, setMessage] = useState<string>();
  const [running, setRunning] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string>();
  const [fileType, setFileType] = useState<string>('stac');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
          </div>
        </div>
      </div>
    );
  };

  const renderFileSelector = () => {
    return (
      <div className="data-loader__file">
        {fileType === 'stac' ? (
          <h2>Please select a STAC file</h2>
        ) : (
          <h2>Please select your Access Policy file</h2>
        )}
        <input
          ref={fileInputRef}
          accept=".json"
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
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
          onChange={(e) => {
            setFile(null);
            setFileName('');
            fileInputRef.current.value = '';
            setState('validate');
            setMessage('');
            setFileType(e.target.value);
          }}
        >
          <option value={'stac'}>STAC</option>
          <option value={'access-policy'}>Access Policy</option>
        </select>
      </div>
    );
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
    if (!file) {
      setMessage('Please select a file before running validation');
      return;
    }

    setRunning(true);
    setMessage('Validating file');
    try {
      if (fileType === 'access-policy') validateAccessPolicy();
      if (fileType === 'stac') await validateSTAC();
      setMessage('File successfully validated');
      setState('upload');
    } catch (error) {
      console.error(error);
    }
    setRunning(false);
  };

  const validateAccessPolicy = async () => {
    if (!file) {
      setMessage('Please select a file before running validation');
      return;
    }

    setRunning(true);
    setMessage('Validating Access Policy');
    try {
      const text = await file.text();
      JSON.parse(text);
      setMessage('File successfully validated');
      setState('upload');
      setFileName('access-policy.json');
    } catch {
      setMessage('Invalid JSON');
    }
    setRunning(false);
  };

  const validateSTAC = async () => {
    const stacContent = await file.text();
    let stac;
    try {
      stac = JSON.parse(stacContent);
    } catch (e) {
      setMessage('❌ Invalid JSON format');
      throw new Error();
    }

    let ajv;

    try {
      ajv = new Ajv({ strict: false });
      addFormats(ajv);
      ajv.addMetaSchema(draft07);
      ajv.addSchema(feature, 'https://geojson.org/schema/Feature.json');
      ajv.addSchema(geometry, 'https://geojson.org/schema/Geometry.json');
      ajv.addSchema(
        basics,
        'https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/basics.json',
      );
      ajv.addSchema(
        datetime,
        'https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/datetime.json',
      );
      ajv.addSchema(
        instrument,
        'https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/instrument.json',
      );
      ajv.addSchema(
        licensing,
        'https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/licensing.json',
      );
      ajv.addSchema(
        provider,
        'https://schemas.stacspec.org/v1.0.0/item-spec/json-schema/provider.json',
      );
    } catch (error) {
      setMessage('❌ Schema fetch failed');
      throw new Error();
    }

    const ajvValidate = ajv.compile(schema);
    const valid = ajvValidate(stac);

    if (valid) {
      setMessage('✅ STAC item is valid!');
    } else {
      setMessage('❌ STAC item is invalid');
      setValidationErrors(ajvValidate.errors);
      throw new Error();
    }
  };

  const upload = async () => {
    if (fileType === 'stac') {
      const valid = validateFileName();
      if (!valid) return;
    }
    setRunning(true);
    setMessage('Uploading file');

    try {
      const stacContent = await file.text();
      const body = {
        fileContent: stacContent,
        fileName,
      };

      const res = await fetch(`/api/workspaces/${activeWorkspace.name}/data-loader`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        setMessage('Failed to upload file to s3');
        throw new Error();
      }

      setState('harvest');
      setMessage('File successfully uploaded');
    } catch (error) {
      console.error(error);
    }

    setRunning(false);
  };

  const harvest = async () => {
    setRunning(true);
    setMessage('STAC file harvest in progress, check back later');
    try {
      await fetch(`/workspaces/${activeWorkspace.name}/harvest`, { method: 'POST' });
    } catch (error) {
      console.error(error);
      setMessage('Failed to start harvest');
    }
    setRunning(false);
  };

  return (
    <div className="content-page">
      {renderHeader()}
      <div className="data-loader">
        {renderDropdown()}
        {renderFileSelector()}
        {state === 'upload' ? renderFileNameField() : null}
        {renderButton()}
        {message && <div className="data-loader__message">{message}</div>}
        {validationErrors && (
          <div className="data-loader__errors">{JSON.stringify(validationErrors, null, 2)}</div>
        )}
      </div>
    </div>
  );
};

export default DataLoader;
