import React from 'react';
import { render } from '@testing-library/react';
import { useLocation } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

describe('ScrollToTop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children without any visible output', () => {
    useLocation.mockReturnValue({
      pathname: '/test',
      search: '',
      hash: '',
      state: null,
      key: 'test-key',
    });

    const { container } = render(
      <ScrollToTop>
        <div data-testid="child-content">Test Content</div>
      </ScrollToTop>
    );

    expect(container.firstChild).toHaveTextContent('Test Content');
  });

  it('should call window.scrollTo when location changes', () => {
    const initialLocation = {
      pathname: '/initial',
      search: '',
      hash: '',
      state: null,
      key: 'initial-key',
    };

    const newLocation = {
      pathname: '/new-path',
      search: '',
      hash: '',
      state: null,
      key: 'new-key',
    };

    useLocation.mockReturnValue(initialLocation);

    const { rerender } = render(
      <ScrollToTop>
        <div>Content</div>
      </ScrollToTop>
    );

    // Initial render should call scrollTo
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
    expect(mockScrollTo).toHaveBeenCalledTimes(1);

    // Change location
    useLocation.mockReturnValue(newLocation);
    rerender(
      <ScrollToTop>
        <div>Content</div>
      </ScrollToTop>
    );

    // Should call scrollTo again
    expect(mockScrollTo).toHaveBeenCalledTimes(2);
    expect(mockScrollTo).toHaveBeenLastCalledWith(0, 0);
  });

  it('should scroll to top on pathname change', () => {
    useLocation.mockReturnValue({
      pathname: '/page1',
      search: '',
      hash: '',
      state: null,
      key: 'key1',
    });

    const { rerender } = render(
      <ScrollToTop>
        <div>Page 1</div>
      </ScrollToTop>
    );

    mockScrollTo.mockClear();

    // Change to different pathname
    useLocation.mockReturnValue({
      pathname: '/page2',
      search: '',
      hash: '',
      state: null,
      key: 'key2',
    });

    rerender(
      <ScrollToTop>
        <div>Page 2</div>
      </ScrollToTop>
    );

    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should scroll to top on search parameter change', () => {
    useLocation.mockReturnValue({
      pathname: '/search',
      search: '?q=initial',
      hash: '',
      state: null,
      key: 'search1',
    });

    const { rerender } = render(
      <ScrollToTop>
        <div>Search Results</div>
      </ScrollToTop>
    );

    mockScrollTo.mockClear();

    // Change search parameters
    useLocation.mockReturnValue({
      pathname: '/search',
      search: '?q=updated',
      hash: '',
      state: null,
      key: 'search2',
    });

    rerender(
      <ScrollToTop>
        <div>Updated Search Results</div>
      </ScrollToTop>
    );

    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should handle multiple children', () => {
    useLocation.mockReturnValue({
      pathname: '/multi',
      search: '',
      hash: '',
      state: null,
      key: 'multi-key',
    });

    const { container } = render(
      <ScrollToTop>
        <div>First Child</div>
        <div>Second Child</div>
        <span>Third Child</span>
      </ScrollToTop>
    );

    expect(container).toHaveTextContent('First Child');
    expect(container).toHaveTextContent('Second Child');
    expect(container).toHaveTextContent('Third Child');
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should work without children', () => {
    useLocation.mockReturnValue({
      pathname: '/empty',
      search: '',
      hash: '',
      state: null,
      key: 'empty-key',
    });

    expect(() => {
      render(<ScrollToTop />);
    }).not.toThrow();

    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });
});