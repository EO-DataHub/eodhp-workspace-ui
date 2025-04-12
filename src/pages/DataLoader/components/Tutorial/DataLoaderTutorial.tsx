import React from 'react';
import './styles.scss';

import STACDescription from '../../descriptions/STACDescription';

const DataLoaderTutorial = () => {
  return (
    <div className="data-loader-tutorial">
      <h1>Data Loader</h1>
      <div className="data-loader__tutorial">
        <h2>How to Use the STAC Data Loader</h2>
        <p>
          The STAC Data Loader helps you create STAC Collections and load STAC Items in bulk. Each
          STAC Item is automatically validated to ensure it meets the required format, then uploaded
          to our cloud storage (S3), and finally processed through our custom harvest pipeline,
          which stores the data in our server and makes it accessible via a unique URL.
        </p>

        <STACDescription />

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
