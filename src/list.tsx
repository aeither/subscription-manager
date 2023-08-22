import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, gql } from "@apollo/client";
import { Action, ActionPanel, Detail, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import fetch from "cross-fetch";
import { schemaUID } from "./utils/constants";

interface AttestationData {
  getSchema: {
    attestations: Attestation[];
  };
}
interface Attestation {
  recipient: string;
  attester: string;
  expirationTime: string; // You might want to use a Date type if appropriate
  revoked: boolean;
  decodedDataJson: string; // You might want to use a more specific type based on the actual data structure
  txid: string;
}

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
  const result = await client.query<AttestationData>({
    query: GET_SCHEMA,
    variables: {
      where: {
        id: schemaUID,
      },
    },
  });

  return result.data;
};

export default function Command() {
  const { isLoading, error, data } = useCachedPromise(getList, [], {
    keepPreviousData: true,
  });

  // Use the data here as needed
  console.log(data);

  return (
    <ApolloProvider client={client}>
      <List isLoading={isLoading}>
        <List.EmptyView title={"loading..."} />

        {data?.getSchema.attestations.map((atts) => (
          <List.Item
            key={atts.txid}
            title={atts.txid}
            actions={
              <ActionPanel>
                <Action.Push title="Show Details" target={<DetailPage />} />
              </ActionPanel>
            }
          />
        ))}
      </List>
    </ApolloProvider>
  );
}

function DetailPage() {
  return <Detail markdown="DetailPage" />;
}
