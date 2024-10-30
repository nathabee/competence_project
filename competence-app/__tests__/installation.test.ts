// __tests__/installation.test.ts
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '@/app/login/LoginForm'; // Correct path to your LoginForm component

// Mock the `useAuth` hook
const mockLogin = jest.fn();
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// Mock useRouter from next/navigation
const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    render(<LoginForm />); 
  });

  it('renders the LoginForm component', () => {
    expect(screen.getByText(/login/i)).toBeInTheDocument(); // Adjust based on your form structure
  });

  it('renders the input fields', () => {
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument(); // Adjust to match your form
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument(); // Adjust to match your form
  });

  it('handles login correctly', async () => {
    const usernameInput = screen.getByPlaceholderText(/username/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(loginButton);

    await waitFor(() => expect(mockLogin).toHaveBeenCalled());
    expect(mockRouterPush).toHaveBeenCalledWith('/dashboard'); // Check for redirect
  });
});
