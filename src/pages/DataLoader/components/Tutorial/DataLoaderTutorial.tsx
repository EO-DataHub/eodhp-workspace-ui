/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import './styles.scss';

const DataLoaderTutorial = () => {
  return (
    <div className="data-loader-tutorial">
      <h1>Metadata Loader</h1>
      <div className="data-loader__tutorial">
        <h2>How to Use the STAC Metadata Loader</h2>
        <p>
          The STAC Metadata Loader helps you create STAC Collections and load STAC Items in bulk.
          Each STAC Item is automatically validated to ensure it meets the required format, then
          uploaded to your workspace, which stores the data and makes it accessible via a unique
          URL.
        </p>

        <div>
          <h3>What is a STAC Collection?</h3>
          <p>
            A STAC Collection groups together related STAC Items (like satellite images or
            geospatial assets). Collections include common metadata (such as spatial extents and
            temporal intervals) and typically require a <code>summaries</code> field that can
            contain recommended information like available bands (e.g. <code>eo:bands</code>).
          </p>

          <h3>What is a STAC Item?</h3>
          <p>
            A STAC Item represents a single geospatial asset. It must include spatial information (a
            valid GeoJSON <code>geometry</code> and a <code>bbox</code>), temporal metadata (like
            the acquisition date), and details about its assets (e.g. links to images or data
            files).
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

        <h3>Workflow</h3>
        <ol>
          <li>
            <strong>Select a Catalog:</strong> Choose a catalog from which you want to work. This
            serves as a container for your collections.
          </li>
          <li>
            <strong>Create or Select a Collection:</strong>
            <ul>
              <li>
                To <em>create a new collection</em>, use our UI to define collection details (name,
                description, summaries, etc.).
              </li>
              <li>
                If you prefer an existing one, simply select your desired STAC Collection from the
                catalog.
              </li>
            </ul>
          </li>
          <li>
            <strong>Select Files:</strong> Use the file selector to choose your STAC Item JSON
            files. You can upload multiple files if needed.
          </li>
          <li>
            <strong>Validate:</strong> Click “Validate” to run automated checks on your STAC Items.
            The tool will highlight any issues so you can correct them.
          </li>
          <li>
            <strong>Upload:</strong> Once validated, click “Upload” to store your files in S3.
          </li>
          <li>
            <strong>Harvest:</strong> Finally, trigger the “Harvest” process, which extracts the
            data from your STAC Items and saves it into our custom server/database, making it
            accessible via a URL.
          </li>
        </ol>

        <p>
          By following these steps, you'll ensure that every STAC Item you load is valid, properly
          organized, and immediately available for further use across our system.
        </p>
      </div>
    </div>
  );
};

export default DataLoaderTutorial;
