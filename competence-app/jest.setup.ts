// jest.setup.ts
import '@testing-library/jest-dom'

// If using next/navigation, change the import as necessary
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
