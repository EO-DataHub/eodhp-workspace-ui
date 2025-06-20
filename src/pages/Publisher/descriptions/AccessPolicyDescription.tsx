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
        "/path/to/file": {"access": "public"},
        "/path/to/file/another.json": {"access": "private"}
    },
    "object-store": {
        "/path/to/file/qa-check": {"access": "public"}
    },
    "catalogue": {
        "my-catalogue-name": {"access": "public"}
    },
    "workflows": {
        "my-workflow-name": {"access": "public"}
    }
}`}</code>
      </pre>
    </div>
  );
};

export default AccessPolicyDescription;
