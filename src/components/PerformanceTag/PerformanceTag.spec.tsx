import { render } from '@testing-library/react';
import { PerformanceTag } from './PerformanceTag';

describe('PerformanceTag', () => {
  it('renders correctly with positive number', () => {
    const { container } = render(<PerformanceTag percent={10} number={100} />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with negative number', () => {
    const { container } = render(<PerformanceTag percent={-5} number={-50} />);
    expect(container).toMatchSnapshot();
  });

  it('renders correctly with zero number', () => {
    const { container } = render(<PerformanceTag percent={0} number={0} />);
    expect(container).toMatchSnapshot();
  });
});
