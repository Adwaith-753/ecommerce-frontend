import { render, screen } from '@testing-library/react';

test('renders a basic shopper heading', () => {
  render(<h1>SHOPPER</h1>);
  const heading = screen.getByText(/shopper/i);
  expect(heading).toBeInTheDocument();
});
