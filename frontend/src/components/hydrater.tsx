import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { instanceToPlain } from 'class-transformer';
import { PropsWithChildren } from 'react';
import { DehydratedState } from '@tanstack/query-core';

type Props = PropsWithChildren<{
  queryClient: QueryClient;
}>;
export default function Hydrater({ queryClient, children }: Props) {
  const dehydrated = instanceToPlain(dehydrate(queryClient)) as DehydratedState;

  return <HydrationBoundary state={dehydrated}>{children}</HydrationBoundary>;
}
