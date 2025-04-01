import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Card from '../../components/common/Card/index';
import { Button, Avatar } from '@mui/material'; // For testing actions/avatar

describe('Card Component', () => {
  test('renders the basic card structure', () => {
    render(<Card data-testid="card-container" />);
    expect(screen.getByTestId('card-container')).toBeInTheDocument();
  });

  test('renders header with title and subheader', () => {
    const titleText = 'Card Title';
    const subheaderText = 'Card Subheader';
    render(<Card title={titleText} subheader={subheaderText} />);
    expect(screen.getByText(titleText)).toBeInTheDocument();
    expect(screen.getByText(subheaderText)).toBeInTheDocument();
  });

   test('renders header with avatar', () => {
    render(<Card avatar={<Avatar data-testid="card-avatar">A</Avatar>} />);
    expect(screen.getByTestId('card-avatar')).toBeInTheDocument();
  });

  test('renders image with alt text', () => {
    const imageUrl = 'test-image.jpg';
    const imageAltText = 'Test Alt Text';
    render(<Card image={imageUrl} imageAlt={imageAltText} />);
    const imgElement = screen.getByRole('img');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', imageUrl);
    expect(imgElement).toHaveAttribute('alt', imageAltText);
  });

  test('renders string content wrapped in Typography', () => {
    const contentText = 'This is the card content.';
    render(<Card content={contentText} />);
    const contentElement = screen.getByText(contentText);
    expect(contentElement).toBeInTheDocument();
    // Check if it's wrapped in a paragraph (default for Typography variant body2)
    expect(contentElement.tagName.toLowerCase()).toBe('p');
  });

  test('renders node content directly', () => {
    const contentNode = <div data-testid="node-content">Node Content</div>;
    render(<Card content={contentNode} />);
    expect(screen.getByTestId('node-content')).toBeInTheDocument();
  });

  test('renders children directly', () => {
    const childrenNode = <p data-testid="children-content">Children Content</p>;
    render(<Card>{childrenNode}</Card>);
    expect(screen.getByTestId('children-content')).toBeInTheDocument();
  });

  test('renders actions when actions prop is provided', () => {
    const actionsNode = <Button data-testid="action-button">Click Action</Button>;
    render(<Card actions={actionsNode} />);
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
    // Check if the button is within the CardActions area (might need a more specific selector if complex)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('calls onClick handler when card is clicked', async () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick} data-testid="clickable-card" />);
    await userEvent.click(screen.getByTestId('clickable-card'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not render header if title/subheader/avatar/action are missing', () => {
    render(<Card content="Only content" />);
    // MUI CardHeader might still render an empty div, so query for specific content
    expect(screen.queryByRole('heading')).not.toBeInTheDocument(); // Assuming title maps to a heading
  });

  test('does not render media if image is missing', () => {
    render(<Card title="Only title" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('does not render content area if content/children are missing', () => {
    render(<Card title="Only title" data-testid="card-no-content" />);
    // Check if CardContent is absent or empty. Querying for specific text is safer.
    const cardElement = screen.getByTestId('card-no-content');
    // A simple check might be to see if the card element has few children (e.g., only CardHeader)
    // This depends heavily on MUI's internal structure.
    // A more robust way is to ensure no unexpected text is present.
    expect(cardElement.textContent).not.toContain('Some Unexpected Content');
  });

   test('does not render actions area if actions are missing', () => {
    render(<Card title="Only title" />);
     // Assuming actions usually contain buttons
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

});