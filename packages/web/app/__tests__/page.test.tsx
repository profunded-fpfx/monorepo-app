import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    // Verificar que el componente se renderiza
    expect(document.body).toBeInTheDocument();
  });

  it('renders Next.js logo', () => {
    render(<Home />);
    const logo = screen.getByRole('img', { name: /next\.js logo/i });
    expect(logo).toBeInTheDocument();
  });
});
