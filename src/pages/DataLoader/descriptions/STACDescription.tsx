/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const STACDescription = () => {
  return (
    <div>
      <h3>What is a STAC Collection?</h3>
      <p>
        A STAC Collection groups together related STAC Items (like satellite images or geospatial
        assets). Collections include common metadata (such as spatial extents and temporal
        intervals) and typically require a <code>summaries</code> field that can contain recommended
        information like available bands (e.g. <code>eo:bands</code>).
      </p>

      <h3>What is a STAC Item?</h3>
      <p>
        A STAC Item represents a single geospatial asset. It must include spatial information (a
        valid GeoJSON <code>geometry</code> and a <code>bbox</code>), temporal metadata (like the
        acquisition date), and details about its assets (e.g. links to images or data files).
      </p>

      <h3>Learn more about STAC</h3>
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
