// __tests__/UserProfile.test.tsx
import { render, screen } from '@testing-library/react';
import EleveDisplay from '../src/components/EleveDisplay';
import { Eleve } from '../src/types/eleve';
import eleves from '../src/demo/data/eleves.json';  // Import JSON data

// Use the first item from the imported JSON data as mockEleve1
const mockEleve1: Eleve = eleves[0];

describe('EleveProfile Component', () => {
  it('renders user data correctly', () => {
    render(<EleveDisplay eleve={mockEleve1} />);
    expect(screen.getByText(new RegExp(mockEleve1.nom, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockEleve1.professeurs_details[0].last_name, 'i'))).toBeInTheDocument();
  });
});
