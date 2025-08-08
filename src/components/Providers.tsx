"use client";

import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { apolloClient } from "@/lib/apollo";
import { StoreProvider } from "@/components/StoreProvider";
import { StoreConfig } from "@/lib/store-config";
import { AppConfigLoader } from "./AppConfigLoader";

interface ProvidersProps {
  children: React.ReactNode;
  session?: any;
  initialStore?: StoreConfig;
}

export function Providers({ children, session, initialStore }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <AppConfigLoader>{children}</AppConfigLoader>
      </ApolloProvider>
    </SessionProvider>
  );
}
