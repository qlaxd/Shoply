import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomPageHeader from '../../components/common/PageHeader/index'; // Assuming the export name is CustomPageHeader

describe('CustomPageHeader Component', () => {
  const testTitle = 'My Page Title';

  test('renders the component structure', () => {
    // Simple render check to catch basic errors
    render(<CustomPageHeader title={testTitle} />);
    // Check if the title text itself is present
    expect(screen.getByText(testTitle)).toBeInTheDocument();
  });

  test('displays the provided title text', () => {
    render(<CustomPageHeader title={testTitle} />);
    // More specific check using heading role and name
    const headingElement = screen.getByRole('heading', { name: testTitle });
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the title as an h1 heading', () => {
    render(<CustomPageHeader title={testTitle} />);
    // Check the role and level explicitly
    const headingElement = screen.getByRole('heading', { level: 1, name: testTitle });
    expect(headingElement).toBeInTheDocument();
    // Optionally, check the tag name if needed, though role/level is preferred
    // expect(headingElement.tagName.toLowerCase()).toBe('h1');
  });
});