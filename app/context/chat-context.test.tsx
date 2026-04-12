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

  it('nextStep incrementa step e seta direction next', async () => {
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      result.current.nextStep();
    });

    expect(result.current.step).toBe(2);
    expect(result.current.direction).toBe('next');
  });

  it('prevStep não vai abaixo de 1', async () => {
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      result.current.prevStep();
    });

    expect(result.current.step).toBe(1);
  });

  it('prevStep seta direction back', async () => {
    const { result } = renderHook(() => useChat(), { wrapper });

    await act(async () => {
      result.current.nextStep();
    });

    await act(async () => {
      result.current.prevStep();
    });

    expect(result.current.direction).toBe('back');
  });
});