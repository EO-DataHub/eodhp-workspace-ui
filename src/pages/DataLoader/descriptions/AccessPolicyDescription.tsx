import React from 'react';

const AccessPolicyDescription = () => {
  return (
    <div className="data-loader__description">
      The access policies are used to set user-defined access to user catalogues, stores and
      workflows
      <h3>Example</h3>
      <pre>
        <code>{`
{
    "block-store": {
        "/path/to/file": {"access": "public"}
        "/path/to/file/another": {"access": "private"}
    },
    "object-store": {
        "/processing-results/qa-check": {"access": "public"}
    },
    "catalogue": {
        "/catalogs/processing-results/catalogs/qa-check": {"access": "public"}
    },
    "workflows": {
        "my-workflow-name": {"access": "public"}
    }
}
 `}</code>
      </pre>
    </div>
  );
};

export default AccessPolicyDescription;
