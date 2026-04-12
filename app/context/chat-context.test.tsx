import { render, act } from '@testing-library/react';
import { ChatProvider, useChat } from './ChatContext';

function setup() {
  let hook: ReturnType<typeof useChat>;

  const TestComponent = () => {
    hook = useChat();
    return null;
  };

  render(
    <ChatProvider>
      <TestComponent />
    </ChatProvider>
  );

  // @ts-ignore
  return hook!;
}

describe('useChat', () => {
  it('começa no step 1 com direction next', () => {
    const hook = setup();

    expect(hook.step).toBe(1);
    expect(hook.direction).toBe('next');
  });

  it('nextStep incrementa step e seta direction next', () => {
    const hook = setup();

    act(() => {
      hook.nextStep();
    });

    expect(hook.step).toBe(2);
    expect(hook.direction).toBe('next');
  });

  it('prevStep não vai abaixo de 1', () => {
    const hook = setup();

    act(() => {
      hook.prevStep();
    });

    expect(hook.step).toBe(1);
  });

  it('prevStep seta direction back', () => {
    const hook = setup();

    act(() => {
      hook.nextStep();
    });

    act(() => {
      hook.prevStep();
    });

    expect(hook.direction).toBe('back');
  });
});