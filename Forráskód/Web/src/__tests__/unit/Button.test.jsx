import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// Adjust the import path based on the actual location relative to the test file
import Button from '../../components/common/Button/index';

// Mock console.error to avoid PropTypes warnings in test output if needed
// console.error = jest.fn();

describe('Button Component', () => {
  test('renders button with children text', () => {
    const buttonText = 'Click Me';
    render(<Button>{buttonText}</Button>);

    // Find the button by its role and accessible name (the text content)
    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn(); // Create a mock function
    const buttonText = 'Clickable';
    render(<Button onClick={handleClick}>{buttonText}</Button>);

    const buttonElement = screen.getByRole('button', { name: buttonText });
    await userEvent.click(buttonElement); // Simulate user click

    expect(handleClick).toHaveBeenCalledTimes(1); // Check if the mock function was called
  });

  test('does not call onClick handler when disabled', () => {
    const handleClick = jest.fn();
    const buttonText = 'Disabled Button';
    render(<Button onClick={handleClick} disabled>{buttonText}</Button>);

    const buttonElement = screen.getByRole('button', { name: buttonText });
    fireEvent.click(buttonElement);

    expect(handleClick).not.toHaveBeenCalled();
  });

  test('is disabled when disabled prop is true', () => {
    const buttonText = 'Cannot Click';
    render(<Button disabled>{buttonText}</Button>);

    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toBeDisabled(); // Check the disabled attribute
  });

  test('sets the correct type attribute', () => {
    const buttonText = 'Submit Form';
    render(<Button type="submit">{buttonText}</Button>);

    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });

   test('renders with default type="button" if not specified', () => {
    const buttonText = 'Default Type';
    render(<Button>{buttonText}</Button>);

    const buttonElement = screen.getByRole('button', { name: buttonText });
    expect(buttonElement).toHaveAttribute('type', 'button');
  });

});