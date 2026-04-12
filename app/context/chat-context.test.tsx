import { renderHook, act } from '@testing-library/react';
import { ChatProvider, useChat } from './ChatContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ChatProvider>{children}</ChatProvider>
);


describe('useChat', () => {
  it('começa no step 1 com direction next', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current.step).toBe(1);
    expect(result.current.direction).toBe('next');
  });

  it('nextStep incrementa step e seta direction next', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => result.current.nextStep());
    expect(result.current.step).toBe(2);
    expect(result.current.direction).toBe('next');
  });

  it('prevStep não vai abaixo de 1', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => result.current.prevStep());
    expect(result.current.step).toBe(1);
  });

  it('prevStep seta direction back', () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    act(() => result.current.nextStep());
    act(() => result.current.prevStep());
    expect(result.current.direction).toBe('back');
  });

  it('lança erro se usado fora do provider', () => {
    let error: unknown;

    try {
      renderHook(() => useChat());
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe(
      'useChat must be used within ChatProvider'
    );
  });
});