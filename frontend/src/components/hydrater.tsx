import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { instanceToPlain } from 'class-transformer';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  queryClient: QueryClient;
}>;
export default function Hydrater({ queryClient, children }: Props) {
  const dehydrated = instanceToPlain(dehydrate(queryClient));

  return <HydrationBoundary state={dehydrated}>{children}</HydrationBoundary>;
}
