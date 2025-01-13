import { Button } from '@/components/Button/Button';
import './Row.scss';

type RowProps = {
  title: string;
  description: string;
  dateRange: string;
  action: {
    label: string;
    onClick: () => void;
  }[];
  thumbnail?: string;
};

export const Row = ({ title, description, dateRange, action, thumbnail }: RowProps) => {
  return (
    <div className="row">
      <div className="row__left">
        <h3 className="row__title">{title}</h3>
        <p className="row__description">{description}</p>
        <p className="row__date-range">{dateRange}</p>
        <div className="row__actions">
          {action.map((a, index) => (
            <Button key={index} onClick={a.onClick}>
              {a.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="row__right">
        {/* Thumbnail */}
        <img alt="thumbnail" className="row__thumbnail" src={thumbnail} />
      </div>
    </div>
  );
};
