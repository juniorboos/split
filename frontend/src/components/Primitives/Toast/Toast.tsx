import * as React from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { keyframes, styled } from '@/styles/stitches/stitches.config';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { ROUTES } from '@/utils/routes';
import { useEffect } from 'react';
import Text from '../Text/Text';
import Button from '../Inputs/Button/Button';

const hide = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const StyledViewport = styled(ToastPrimitive.Viewport, {
  position: 'fixed',
  top: '$106',
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  paddingRight: '$162',
  width: 'fit-content',
  maxWidth: '100vw',
  margin: 0,
  listStyle: 'none',
  zIndex: 2147483647,
});

const StyledToast = styled(ToastPrimitive.Root, {
  backgroundColor: 'white',
  py: '$12',
  px: '$16',
  borderRadius: '$12',
  boxShadow: '0px 4px 16px -4px rgba(18, 25, 34, 0.2)',
  display: 'flex',
  height: '$56',
  width: '$362',
  justifyContent: 'space-between',
  alignItems: 'center',
  direction: 'raw',
});

const StyledDescription = styled(ToastPrimitive.Description, {
  display: 'flex',
  gap: '$8',
  margin: 0,
  alignItems: 'center',
});

const StyledClose = styled(ToastPrimitive.Close, Button, {});

// Exports
export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = StyledViewport;

const Toast = () => {
  const [currentToastState, setToastState] = useRecoilState(toastState);
  const { open, type, content } = currentToastState;

  const router = useRouter();
  const VIEWPORT_PADDING = router.asPath === ROUTES.START_PAGE_ROUTE ? 162 : 56;

  const slideIn = keyframes({
    from: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
    to: { transform: 'translateX(0)' },
  });

  const swipeOut = keyframes({
    from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
    to: { transform: `translateX(calc(100% + ${VIEWPORT_PADDING}px))` },
  });

  useEffect(() => {
    setTimeout(() => {
      setToastState({ open: false, type: ToastStateEnum.SUCCESS, content: '' });
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <StyledToast
      duration={7000}
      open={open}
      type="foreground"
      css={{
        '@media (prefers-reduced-motion: no-preference)': {
          '&[data-state="open"]': {
            animation: `${slideIn} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
          },
          '&[data-state="closed"]': {
            animation: `${hide} 100ms ease-in forwards`,
          },
          '&[data-swipe="move"]': {
            transform: 'translateX(var(--radix-toast-swipe-move-x))',
          },
          '&[data-swipe="cancel"]': {
            transform: 'translateX(0)',
            transition: 'transform 200ms ease-out',
          },
          '&[data-swipe="end"]': {
            animation: `${swipeOut} 100ms ease-out forwards`,
          },
        },
      }}
      onOpenChange={(e) => setToastState({ open: e, type, content })}
    >
      <StyledDescription>
        {type === ToastStateEnum.ERROR && <Icon size={32} name="blob-error" />}
        {type === ToastStateEnum.SUCCESS && <Icon size={32} name="blob-success" />}
        {type === ToastStateEnum.WARNING && <Icon size={32} name="blob-warning" />}
        {type === ToastStateEnum.INFO && <Icon size={32} name="blob-info" />}
        <Text size="sm">{content}</Text>
      </StyledDescription>
      <StyledClose aria-label="Close" size="sm" isIcon>
        <Icon size={16} css={{ color: '$primary800' }} name="close" />
      </StyledClose>
    </StyledToast>
  );
};

export default Toast;
