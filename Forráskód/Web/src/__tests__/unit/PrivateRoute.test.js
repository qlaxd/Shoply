import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from '../../utils/PrivateRoute';

// Mock components for testing
const MockOutlet = () => <div>Protected Content</div>;
const LoginPage = () => <div>Login Page</div>;

describe('PrivateRoute', () => {
  let mockLocalStorage;

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
  });

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/protected" element={component}>
            <Route index element={<MockOutlet />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it('should render outlet when user is authenticated', () => {
    mockLocalStorage.getItem.mockReturnValue('mock-token');

    const { getByText } = renderWithRouter(<PrivateRoute />);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { getByText } = renderWithRouter(<PrivateRoute />);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    expect(getByText('Login Page')).toBeInTheDocument();
  });

  it('should redirect to login when token is empty string', () => {
    mockLocalStorage.getItem.mockReturnValue('');

    const { getByText } = renderWithRouter(<PrivateRoute />);

    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
    expect(getByText('Login Page')).toBeInTheDocument();
  });
}); 