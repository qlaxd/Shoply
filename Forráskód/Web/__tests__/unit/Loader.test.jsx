import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../../src/components/common/Loader/index';

describe('Loader Component', () => {
  test('renders the circular progress indicator by default', () => {
    render(<Loader />);
    // MUI CircularProgress typically has role="progressbar"
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
  });

  test('renders text when text prop is provided', () => {
    const loadingText = 'Loading data...';
    render(<Loader text={loadingText} />);
    const textElement = screen.getByText(loadingText);
    expect(textElement).toBeInTheDocument();
    // Also check the progress bar is still there
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('does not render text when text prop is omitted', () => {
    render(<Loader />);
    // Assuming the text is unique enough, queryByText returns null if not found
    const textElement = screen.queryByText(/./); // Check for any text content
    expect(textElement).not.toBeInTheDocument();
  });

  test('applies fullPage styles when fullPage prop is true', () => {
    render(<Loader fullPage data-testid="loader-container" />); // Add data-testid for easier selection
    const container = screen.getByTestId('loader-container');
    expect(container).toHaveStyle('position: fixed');
    expect(container).toHaveStyle('top: 0px');
    expect(container).toHaveStyle('left: 0px');
    expect(container).toHaveStyle('right: 0px');
    expect(container).toHaveStyle('bottom: 0px');
    expect(container).toHaveStyle('background-color: rgba(255, 255, 255, 0.8)');
    expect(container).toHaveStyle('z-index: 1300');
  });

  test('does not apply fullPage styles by default', () => {
    render(<Loader data-testid="loader-container" />);
    const container = screen.getByTestId('loader-container');
    expect(container).not.toHaveStyle('position: fixed');
  });

  // Test rendering with different sizes (primarily checks for runtime errors)
  test('renders correctly with size="small"', () => {
    render(<Loader size="small" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders correctly with size="medium"', () => {
    render(<Loader size="medium" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders correctly with size="large"', () => {
    render(<Loader size="large" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});