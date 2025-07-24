import { PropsWithChildren } from 'react';
import Link, { LinkProps } from 'next/link';

interface Props extends PropsWithChildren, Omit<LinkProps, 'href'> {
  target?: string;
  href?: string | null;
}

export default function ConditionalLink({ href, children, ...rest }: Props) {
  if (!href) return <>{children}</>;
  return (
    <Link
      href={href}
      {...rest}>
      {children}
    </Link>
  );
}
