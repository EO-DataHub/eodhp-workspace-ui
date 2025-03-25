import React, { useState } from 'react';

import Ajv from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

import './styles.scss';

import link from '@/assets/icons/link.svg';
import { Button } from '@/components/Button/Button';

import basics from './schemas/basics.json';
import datetime from './schemas/datetime.json';
import draft07 from './schemas/draft-07.json';
import feature from './schemas/feature.json';
import geometry from './schemas/geometry.json';
import instrument from './schemas/instrument.json';
import licensing from './schemas/licensing.json';
import provider from './schemas/provider.json';

type State = 'validate' | 'upload' | 'harvest';

const DataLoader = () => {
  const [file, setFile] = useState<File>();
  const [state, setState] = useState<State>('validate');
  const [message, setMessage] = useState<string>();
  const [running, setRunning] = useState<boolean>(false);

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
        <h2>Please select STAC file</h2>
        <input accept=".json" type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>
    );
  };

  const renderButton = () => {
    if (state === 'validate') {
      return (
        <Button disabled={running} onClick={validate}>
          {running ? 'Running' : 'Validate'}
        </Button>
      );
    }
    if (state === 'upload') {
      return (
        <Button disabled={running} onClick={upload}>
          {running ? 'Running' : 'Upload'}
        </Button>
      );
    }
    if (state === 'harvest') {
      return (
        <Button disabled={running} onClick={harvest}>
          {running ? 'Running' : 'Harvest'}
        </Button>
      );
    }
  };

  const validate = async () => {
    setRunning(true);
    setMessage('Validating STAC file');
    try {
      await validateSTAC();
      setMessage('File successfully validated');
      setState('upload');
    } catch (error) {
      console.error(error);
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

    let schema;
    let ajv;

    try {
      const schemaUrl =
        'https://raw.githubusercontent.com/radiantearth/stac-spec/v1.0.0/item-spec/json-schema/item.json';
      schema = await fetch(schemaUrl).then((res) => res.json());

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
      console.log(ajvValidate.errors);
      throw new Error();
    }
  };

  const upload = () => {
    setRunning(true);
    setMessage('Validating STAC file');
    setTimeout(() => {
      setRunning(false);
      setState('upload');
      setMessage('File successfully validated');
    }, 3000);
  };

  const harvest = () => {
    setRunning(true);
    setMessage('Validating STAC file');
    setTimeout(() => {
      setRunning(false);
      setState('upload');
      setMessage('File successfully validated');
    }, 3000);
  };

  return (
    <div className="content-page">
      {renderHeader()}
      {message}
      <div className="data-loader">
        {renderFileSelector()}
        {renderButton()}
      </div>
    </div>
  );
};

export default DataLoader;
