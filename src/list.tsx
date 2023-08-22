import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { List } from "@raycast/api";
import { useCachedPromise, usePromise } from "@raycast/utils";
import { EASContractAddress, schemaUID } from "./utils/constants";
import { getSigner } from "./utils/signer";
import { ethers } from "ethers";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, createHttpLink } from "@apollo/client";
import fetch from "cross-fetch";

const httpLink = createHttpLink({
  uri: "https://base-goerli.easscan.org/graphql",
  fetch,
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const GET_SCHEMA = gql`
  query ExampleQuery($where: SchemaWhereUniqueInput!) {
    getSchema(where: $where) {
      attestations {
        recipient
        attester
        expirationTime
        revoked
        decodedDataJson
        txid
      }
    }
  }
`;

const getList = async () => {
  const result = await client.query({
    query: GET_SCHEMA,
    variables: {
      where: {
        id: "0x83422a9c21920ff23e2ca62c3fbd52536c7d90798a6ea0e6926dcc82afc06050",
      },
    },
  });

  console.log("🚀 ~ file: list.tsx:66 ~ getClient ~ result:", result);
  return result;
};

export default function Command() {
  // const { isLoading, data, revalidate } = usePromise(async () => {
  //   const eas = new EAS(EASContractAddress);
  //   const signer = await getSigner();
  //   const provider = ethers.providers.getDefaultProvider("sepolia");
  //   eas.connect(signer as unknown as SignerOrProvider);

  //   const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
  //   const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
  //   schemaRegistry.connect(provider as unknown as SignerOrProvider);

  //   const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

  //   console.log(schemaRecord);
  //   // return attestation;
  // }, []);

  const { isLoading, error, data } = useCachedPromise(getList, [], {
    keepPreviousData: true,
  });

  // Use the data here as needed
  console.log(data);

  return (
    <ApolloProvider client={client}>
      <List isLoading={isLoading}>
        <List.EmptyView title={"loading..."} />
        
        <List.Item title="Item 1" />
        <List.Item title="Item 2" subtitle="Optional subtitle" />
      </List>
    </ApolloProvider>
  );
}

function App() {
  // Use the useQuery hook to fetch data
  const { loading, error, data } = useQuery(GET_SCHEMA, {
    variables: {
      where: {
        id: "0x83422a9c21920ff23e2ca62c3fbd52536c7d90798a6ea0e6926dcc82afc06050",
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Use the data here as needed
  console.log(data);

  return (
    <List>
      <List.Item title="Item 1" />
      <List.Item title="Item 2" subtitle="Optional subtitle" />
    </List>
  );
}
