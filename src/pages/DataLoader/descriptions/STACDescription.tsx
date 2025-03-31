/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const STACDescription = () => {
  return (
    <div className="data-loader__description">
      <h3>What is a STAC file?</h3>
      <p>
        A STAC (SpatioTemporal Asset Catalog) file is a standardized JSON format used to describe
        geospatial data. If you're unsure what it should contain, you can use the resources below:
      </p>
      <ul>
        <li>
          📄{' '}
          <a
            href="https://github.com/radiantearth/stac-spec/blob/v1.0.0/item-spec/item-spec.md"
            rel="noopener noreferrer"
            target="_blank"
          >
            STAC Item Specification
          </a>
        </li>
        <li>
          🧪{' '}
          <a
            href="https://github.com/radiantearth/stac-spec/tree/v1.0.0/examples"
            rel="noopener noreferrer"
            target="_blank"
          >
            STAC Example Files
          </a>
        </li>
      </ul>
    </div>
  );
};

export default STACDescription;
