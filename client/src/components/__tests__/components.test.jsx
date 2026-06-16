/** Component smoke tests: the signature Lifeline + UI helpers render correctly. */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Lifeline from '../Lifeline.jsx';
import { Badge, EmptyState } from '../ui.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Lifeline', () => {
  it('renders an accessible SVG with a descriptive label', () => {
    render(<Lifeline />);
    expect(screen.getByRole('img', { name: /heartbeat/i })).toBeInTheDocument();
  });

  it('renders a static line when animation is disabled', () => {
    const { container } = render(<Lifeline animate={false} showDots={false} />);
    const path = container.querySelector('path');
    expect(path).not.toHaveClass('motion-safe:animate-draw-line');
  });
});

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge tone="healing">Published</Badge>);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders a title and a working CTA link', () => {
    render(
      <MemoryRouter>
        <EmptyState title="Nothing here" body="Check back" cta={{ to: '/donate', label: 'Donate' }} />
      </MemoryRouter>
    );
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Donate' })).toHaveAttribute('href', '/donate');
  });
});
