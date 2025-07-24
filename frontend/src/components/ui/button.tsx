import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export default function Button({ children, className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`${className} flex items-center justify-center gap-2 bg-primary p-2 w-96 max-w-full rounded cursor-pointer font-bold text-white`}>
      {children}
    </button>
  );
}
