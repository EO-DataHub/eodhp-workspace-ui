import React, { useEffect, useState } from 'react';

import { useWorkspace } from '@/hooks/useWorkspace';

const Logs = () => {
  const { activeWorkspace } = useWorkspace();

  //   const [logs, setLogs] = useState<string[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const getLogs = async () => {
      const res = await fetch(`/workspaces/${activeWorkspace.name}/harvest_logs`, {
        method: 'POST',
      });

      if (!res.ok) {
        setError('Failed to get Logs');
        return;
      }

      const json = await res.json();
      console.log(json);
    };
    getLogs();
  });

  return (
    <div className="content-page stores">
      <div className="header">
        <div className="header-left">
          <h2>Logs</h2>
        </div>
      </div>
      {error}
    </div>
  );
};

export default Logs;
