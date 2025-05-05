import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../src/components/common/Input/index';
import SearchIcon from '@mui/icons-material/Search'; // Example icon

describe('Input Component', () => {
  const testLabel = 'Test Label';

  test('renders input with label', () => {
    render(<Input label={testLabel} />);
    expect(screen.getByLabelText(testLabel)).toBeInTheDocument();
  });

  test('displays the correct initial value', () => {
    const initialValue = 'Initial Text';
    render(<Input label={testLabel} value={initialValue} onChange={() => {}} />); // onChange is often required for controlled inputs
    expect(screen.getByLabelText(testLabel)).toHaveValue(initialValue);
  });

  test('calls onChange handler when text is typed', async () => {
    const handleChange = jest.fn();
    render(<Input label={testLabel} value="" onChange={handleChange} />);
    const inputElement = screen.getByLabelText(testLabel);
    await userEvent.type(inputElement, 'hello');
    // Check the last call specifically for the full typed string if needed
    expect(handleChange).toHaveBeenCalledTimes(5); // Called for each character 'h', 'e', 'l', 'l', 'o'
    // Check that onChange was called for each character typed.
    // Verifying the final value displayed is better suited for integration tests
    // or tests involving state management.
    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  test('calls onFocus handler when focused', async () => {
    const handleFocus = jest.fn();
    render(<Input label={testLabel} onFocus={handleFocus} />);
    const inputElement = screen.getByLabelText(testLabel);
    await userEvent.click(inputElement); // Clicking focuses the input
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

   test('calls onBlur handler when blurred', async () => {
    const handleBlur = jest.fn();
    render(<Input label={testLabel} onBlur={handleBlur} />);
    const inputElement = screen.getByLabelText(testLabel);
    await userEvent.click(inputElement); // Focus
    await userEvent.tab(); // Tab away to blur
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  test('displays helper text when helperText prop is provided', () => {
    const helper = 'Some helpful text';
    render(<Input label={testLabel} helperText={helper} />);
    // Helper text is usually associated via aria-describedby, but MUI might render it directly.
    // Check if the text exists in the document.
    expect(screen.getByText(helper)).toBeInTheDocument();
  });

  test('displays error message and sets aria-invalid when error prop is provided', () => {
    const errorMsg = 'This field is required';
    render(<Input label={testLabel} error={errorMsg} />);
    const inputElement = screen.getByLabelText(testLabel);
    expect(screen.getByText(errorMsg)).toBeInTheDocument(); // Error shown as helper text
    expect(inputElement).toHaveAttribute('aria-invalid', 'true');
  });

   test('does not set aria-invalid when error prop is not provided', () => {
    render(<Input label={testLabel} />);
    const inputElement = screen.getByLabelText(testLabel);
    expect(inputElement).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('renders start icon when startIcon prop is provided', () => {
    render(<Input label={testLabel} startIcon={<SearchIcon data-testid="start-icon" />} />);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  test('renders end icon when endIcon prop is provided', () => {
    render(<Input label={testLabel} endIcon={<SearchIcon data-testid="end-icon" />} />);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  test('is disabled when disabled prop is true', () => {
    render(<Input label={testLabel} disabled />);
    expect(screen.getByLabelText(testLabel)).toBeDisabled();
  });

  test('has required attribute when required prop is true', () => {
    render(<Input label={testLabel} required />);
    // Find the input associated with the label, ignoring the asterisk (*) MUI adds
    expect(screen.getByLabelText(testLabel, { exact: false })).toBeRequired();
  });

  test('renders as a textarea when multiline prop is true', () => {
    render(<Input label={testLabel} multiline />);
    // Multiline inputs usually have the role 'textbox' but are textarea elements
    const inputElement = screen.getByLabelText(testLabel);
    expect(inputElement.tagName.toLowerCase()).toBe('textarea');
  });
});