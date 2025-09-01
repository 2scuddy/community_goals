import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppImage from '../AppImage';

describe('AppImage', () => {
  const defaultProps = {
    src: 'https://example.com/test-image.jpg',
    alt: 'Test image',
  };

  it('should render image with required props', () => {
    render(<AppImage {...defaultProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', defaultProps.src);
    expect(image).toHaveAttribute('alt', defaultProps.alt);
  });

  it('should render image with custom className', () => {
    const customClass = 'custom-image-class';
    render(<AppImage {...defaultProps} className={customClass} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass(customClass);
  });

  it('should render image with custom width and height', () => {
    render(<AppImage {...defaultProps} width={200} height={150} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('width', '200');
    expect(image).toHaveAttribute('height', '150');
  });

  it('should handle image loading states', () => {
    render(<AppImage {...defaultProps} />);
    
    const image = screen.getByRole('img');
    
    // Simulate image load
    fireEvent.load(image);
    expect(image).toBeInTheDocument();
  });

  it('should handle image error states', () => {
    render(<AppImage {...defaultProps} />);
    
    const image = screen.getByRole('img');
    
    // Simulate image error
    fireEvent.error(image);
    expect(image).toBeInTheDocument();
  });

  it('should render with default alt text when not provided', () => {
    render(<AppImage src={defaultProps.src} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', '');
  });

  it('should pass through additional props', () => {
    render(
      <AppImage 
        {...defaultProps} 
        id="test-image"
        data-testid="custom-image"
        loading="lazy"
      />
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('id', 'test-image');
    expect(image).toHaveAttribute('data-testid', 'custom-image');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('should handle different image formats', () => {
    const formats = [
      'https://example.com/image.jpg',
      'https://example.com/image.png',
      'https://example.com/image.gif',
      'https://example.com/image.webp',
    ];

    formats.forEach((src, index) => {
      const { rerender } = render(<AppImage src={src} alt={`Test image ${index}`} />);
      
      const image = screen.getByRole('img');
      expect(image).toHaveAttribute('src', src);
      expect(image).toHaveAttribute('alt', `Test image ${index}`);
      
      if (index < formats.length - 1) {
        rerender(<div />); // Clear for next iteration
      }
    });
  });

  it('should handle responsive image props', () => {
    render(
      <AppImage 
        {...defaultProps}
        srcSet="image-320w.jpg 320w, image-480w.jpg 480w, image-800w.jpg 800w"
        sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"
      />
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('srcset', 'image-320w.jpg 320w, image-480w.jpg 480w, image-800w.jpg 800w');
    expect(image).toHaveAttribute('sizes', '(max-width: 320px) 280px, (max-width: 480px) 440px, 800px');
  });

  it('should render with object-fit styles when provided', () => {
    render(<AppImage {...defaultProps} style={{ objectFit: 'cover' }} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveStyle({ objectFit: 'cover' });
  });
});