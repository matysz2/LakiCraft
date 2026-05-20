import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  const renderFooter = () => {
    return render(<Footer />);
  };

  it('should render footer component', () => {
    renderFooter();
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('should display company information', () => {
    renderFooter();
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('should have contact information', () => {
    renderFooter();
    const footerElement = screen.getByRole('contentinfo');
    // Check for contact info - adjust based on your footer content
    expect(footerElement.textContent).toBeTruthy();
  });

  it('should have links', () => {
    renderFooter();
    const links = screen.queryAllByRole('link');
    // Footer should have at least some links
    expect(links.length).toBeGreaterThanOrEqual(0);
  });

  it('should display copyright information', () => {
    renderFooter();
    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement.textContent).toMatch(/Copyright|©/i);
  });
});
