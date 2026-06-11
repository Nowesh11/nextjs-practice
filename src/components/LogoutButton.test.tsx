import { render, screen, fireEvent } from '@testing-library/react';
import LogoutButton from './LogoutButton';
import { signOut } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

describe('LogoutButton', () => {
  test('renders logout button', () => {
    render(<LogoutButton />);
    expect(
      screen.getByRole('button', { name: 'Logout' })
    ).toBeInTheDocument(); // ✅ explicit assertion
  });

  test('button has correct text', () => {
    render(<LogoutButton />);
    expect(
      screen.getByText('Logout')
    ).toBeInTheDocument(); // ✅ explicit assertion
  });

  test('calls signOut when clicked', () => {
    render(<LogoutButton />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Logout' })
    );
    expect(signOut).toHaveBeenCalled(); // ✅ perfect
  });
});