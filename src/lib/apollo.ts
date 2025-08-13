import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react";
const httpLink = createHttpLink({
  uri:
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
});
const authLink = setContext(async (_, { headers }) => {
  // Get the authentication token from NextAuth session
  let token = null;
  if (typeof window !== "undefined") {
    // Client-side: get from NextAuth session
    const session = await getSession();
    token = (session as any)?.accessToken;
    // Fallback: try localStorage for manual login
    if (!token) {
      token = localStorage.getItem("token");
    }
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  ssrMode: typeof window === "undefined",
});
