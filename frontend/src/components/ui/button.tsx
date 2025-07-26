import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import { Button as HButton } from '@headlessui/react';
import { mergeClasses } from '@/utils/class';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export default function Button({ children, className, ...rest }: Props) {
  const classes = mergeClasses(
    className,
    'flex items-center justify-center gap-2 bg-primary p-2 w-96 max-w-full rounded cursor-pointer font-bold text-white shrink min-w-0',
    'hover:bg-primary-400 data-active:bg-primary-600 data-disabled:bg-gray-500 data-disabled:cursor-not-allowed',
  );

  return (
    <HButton
      {...rest}
      className={classes}>
      {children}
    </HButton>
  );
}
