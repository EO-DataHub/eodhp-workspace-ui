import { GiTapir } from 'react-icons/gi';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { SiCss3 } from 'react-icons/si';

import { useWorkspace } from '@/hooks/useWorkspace';

import { Application } from './components/Application';
import { DataHub } from '../DataHub/DataHub';
import { S3 } from '../S3/S3';
import './Applications.scss';

const PLACEHOLDER_APPLICATIONS = [
  {
    name: 'DataHub API',
    description: 'DataHub API',
    icon: GiTapir,
  },
  {
    name: 'S3',
    description: 'S3 Access',
    icon: SiCss3,
  },
];

export const Applications: React.FC = () => {
  const { activeApplication, setActiveApplication } = useWorkspace();

  return (
    <div className="applications-container">
      <div className="path">
        {activeApplication ? (
          <>
            <IoMdArrowRoundBack
              className="back-icon"
              onClick={() => {
                setActiveApplication(undefined);
              }}
            />

            <p>
              <button
                className="root"
                onClick={() => {
                  setActiveApplication(undefined);
                }}
              >
                Applications /
              </button>
              {activeApplication ? <span>{` ${activeApplication}`}</span> : null}
            </p>
          </>
        ) : (
          <p>Applications ( {PLACEHOLDER_APPLICATIONS.length} )</p>
        )}
      </div>
      {/* All Applications */}
      {!activeApplication ? (
        <div className="grid">
          {PLACEHOLDER_APPLICATIONS.map((application) => (
            <Application
              key={application.name}
              description={application.description}
              icon={application.icon}
              name={application.name}
            />
          ))}
        </div>
      ) : null}
      {/* DataHub Application */}
      {activeApplication === 'DataHub API' ? <DataHub /> : null}
      {activeApplication === 'S3' ? <S3 /> : null}
    </div>
  );
};
