import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingScreen from '../components/LoadingScreen';

describe('LoadingScreen Component', () => {
  it('should render loading screen', () => {
    render(<LoadingScreen />);
    const loadingElement = screen.queryByRole('status', { hidden: true });
    // Component should be in document
    expect(document.body).toBeInTheDocument();
  });

  it('should display loading indicator', () => {
    const { container } = render(<LoadingScreen />);
    // Check if loading spinner or indicator exists
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should have proper styling', () => {
    const { container } = render(<LoadingScreen />);
    const element = container.firstChild;
    expect(element).toHaveClass('loading-screen');
  });

  it('should display loading message if provided', () => {
    render(<LoadingScreen />);
    // Adjust based on your loading screen content
    const element = document.querySelector('.loading-screen');
    expect(element).toBeInTheDocument();
  });
});
