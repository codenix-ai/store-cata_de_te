'use client';

import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import { apolloClient } from '@/lib/apollo';
import { StoreProvider } from '@/components/StoreProvider';
import { StoreConfig } from '@/lib/store-config';

interface ProvidersProps {
  children: React.ReactNode;
  session?: any;
  initialStore?: StoreConfig;
}

export function Providers({ children, session, initialStore }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <StoreProvider initialStore={initialStore}>{children}</StoreProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}
