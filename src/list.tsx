import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, gql } from "@apollo/client";
import { Action, ActionPanel, Color, Detail, Icon, List } from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import fetch from "cross-fetch";
import { schemaUID } from "./utils/constants";
import { formatDate, shortAddress } from "./utils/helpers";

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

        <List.Item
          title="An Item with Accessories"
          accessories={[
            { text: `An Accessory Text`, icon: Icon.Hammer },
            { text: { value: `A Colored Accessory Text`, color: Color.Orange }, icon: Icon.Clock },
            { icon: Icon.Person, tooltip: "A person" },
            { text: "Just Do It!" },
            { date: new Date() },
            { tag: new Date() },
            { tag: { value: new Date(), color: Color.Magenta } },
            { tag: { value: "User", color: Color.Magenta }, tooltip: "Tag with tooltip" },
          ]}
        />

        {data?.getSchema.attestations.map((atts) => (
          <List.Item
            key={atts.txid}
            title={shortAddress(atts.txid)}
            subtitle={atts.recipient}
            accessories={[
              {
                tag: { value: formatDate(new Date(+atts.expirationTime * 1000)), color: Color.Magenta },
                icon: Icon.Clock,
              },
            ]}
            actions={
              <ActionPanel>
                <Action.Push title="Show Details" target={<DetailPage {...atts} />} />
              </ActionPanel>
            }
          />
        ))}
      </List>
    </ApolloProvider>
  );
}

function DetailPage(atts: Attestation) {
  return <Detail markdown={`${atts.txid}`} />;
}
