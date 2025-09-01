import { cn } from '../cn';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-blue-500');
    expect(result).toBe('px-2 py-1 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should handle false conditional classes', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class');
  });

  it('should merge conflicting Tailwind classes correctly', () => {
    const result = cn('px-2 px-4', 'py-1 py-2');
    expect(result).toBe('px-4 py-2');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['px-2', 'py-1'], 'bg-blue-500');
    expect(result).toBe('px-2 py-1 bg-blue-500');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'px-2': true,
      'py-1': true,
      'bg-red-500': false,
      'bg-blue-500': true
    });
    expect(result).toBe('px-2 py-1 bg-blue-500');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle null and undefined inputs', () => {
    const result = cn('px-2', null, undefined, 'py-1');
    expect(result).toBe('px-2 py-1');
  });

  it('should handle complex mixed inputs', () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn(
      'base-class',
      ['px-2', 'py-1'],
      {
        'active': isActive,
        'disabled': isDisabled
      },
      isActive && 'text-blue-500',
      'hover:bg-gray-100'
    );
    expect(result).toBe('base-class px-2 py-1 active text-blue-500 hover:bg-gray-100');
  });
});