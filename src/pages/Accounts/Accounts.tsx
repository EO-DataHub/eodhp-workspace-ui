import React, { useEffect, useState } from 'react';

import Expandable from '@/components/Expandable/Expandable';
import { getAccounts } from '@/services/accountsServices';
import { Account } from '@/typings/global';

const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const func = async () => {
      try {
        const _accounts = await getAccounts();
        setAccounts(_accounts);
      } catch (error) {
        setError(error);
      }
    };
    func();
  }, []);

  const renderError = () => {
    return <div>{`${error}`}</div>;
  };
  const renderLoading = () => {
    return <div>Retrieving accounts</div>;
  };

  if (error) return renderError();
  if (!accounts) return renderLoading();

  return (
    <div>
      <h1>Accounts</h1>
      {accounts.map((account) => {
        return <Expandable key={account.id} data={account} title={account.name} />;
      })}
    </div>
  );
};

export default Accounts;
