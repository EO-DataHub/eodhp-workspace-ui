import { render, screen, userEvent } from '@/utils/renderers';

import { Button } from './Button';

describe('Button component', () => {
  it('should render the button with provided children', () => {
    render(<Button onClick={vi.fn()}>Click Me</Button>);

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should apply the default and provided class names', () => {
    const className = 'custom-class';

    render(
      <Button className={className} onClick={vi.fn()}>
        Click me
      </Button>,
    );

    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toHaveClass(className);
  });

  it('should call the onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click Me</Button>);

    await user.click(screen.getByRole('button', { name: /click me/i }));

    expect(onClick).toHaveBeenCalled();
  });

  it('should render correctly without a className', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).not.toHaveClass('custom-class');
  });
});
