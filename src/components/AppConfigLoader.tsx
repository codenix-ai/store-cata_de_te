"use client";

import { gql, useQuery } from "@apollo/client";
import { ReactNode } from "react";
import { StoreProvider } from "./StoreProvider";

const GET_STORE_CONFIG = gql`
  query GetStore($storeId: String!) {
    store(storeId: $storeId) {
      id
      storeId
      name
      primaryColor
      secondaryColor
      accentColor
      backgroundColor
      textColor
      description
      platform
      shopUrl
      status
      currency
      language
      timezone
      isActive
      maintenanceMode
      createdAt
      updatedAt
    }
  }
`;

export function AppConfigLoader({ children }: { children: ReactNode }) {
  const { loading, error, data } = useQuery(GET_STORE_CONFIG, {
    variables: { storeId: "store2" },
  });

  if (loading) return <p>Loading...</p>;
  if (error || !data.store) {
    console.error("Error fetching store config:", error);
    return <div>Error loading store config</div>;
  }

  return <StoreProvider initialStore={data.store}>{children}</StoreProvider>;
}
