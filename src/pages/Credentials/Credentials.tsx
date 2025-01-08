import { DataHub } from '../DataHub/DataHub';
import { S3 } from '../S3/S3';
import './Credentials.scss';

export const Credentials = () => {
  return (
    <div className="content-page credentials">
      <div className="header">
        <div className="header-left">
          <h2>Credentials</h2>
        </div>
        <div className="header-right">
          <img alt="Cloud" src="./icons/cloud.svg" />
          <div className="header-right-text">
            <span className="header-right-title">Credentials </span> are used as a way to
            authenticate with external services.
          </div>
        </div>
      </div>

      <div className="credentials-services">
        <div className="credentials-service">
          <DataHub />
        </div>

        <div className="credentials-service">
          <S3 />
        </div>
      </div>
    </div>
  );
};
