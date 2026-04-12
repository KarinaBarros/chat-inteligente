import { renderHook, act } from '@testing-library/react';
import { ChatProvider, useChat } from './ChatContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChatProvider>{children}</ChatProvider>
);

describe('useChat', () => {
  it('começa correto', () => {
    const { result } = renderHook(() => useChat(), { wrapper });

    expect(result.current.step).toBe(999);
    expect(result.current.direction).toBe('next');
  });

  it('nextStep funciona', () => {
    const { result } = renderHook(() => useChat(), { wrapper });

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.step).toBe(2);
    expect(result.current.direction).toBe('next');
  });

  it('prevStep funciona', () => {
    const { result } = renderHook(() => useChat(), { wrapper });

    act(() => {
      result.current.nextStep();
      result.current.prevStep();
    });

    expect(result.current.direction).toBe('back');
    expect(result.current.step).toBe(1);
  });
});