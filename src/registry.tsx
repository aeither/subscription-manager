import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { Detail } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { ethers } from "ethers";
import { EASContractAddress, SubscriptionAddress, schemaUID } from "./utils/constants";
import { getSigner } from "./utils/signer";

export default function Command() {
  const { isLoading, data, revalidate } = usePromise(async () => {
    const eas = new EAS(EASContractAddress);
    const signer = await getSigner();
    const provider = ethers.providers.getDefaultProvider("sepolia");
    eas.connect(signer as unknown as SignerOrProvider);

    const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
    const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
    schemaRegistry.connect(provider as unknown as SignerOrProvider);

    const schemaRecord = await schemaRegistry.getSchema({ uid: schemaUID });

    console.log(schemaRecord);
    const markdownString = `
    # UID: ${schemaRecord.uid}
    
    Schema: ${schemaRecord.schema}
    `;

    return { description: markdownString, schemaRecord };
  }, []);

  return (
    <Detail
      isLoading={isLoading}
      markdown={data?.description}
      navigationTitle="Registry"
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="Resolver" text={data?.schemaRecord.resolver} />
          <Detail.Metadata.Label title="Schema" text={data?.schemaRecord.schema} />
          <Detail.Metadata.TagList title="Revocable">
            <Detail.Metadata.TagList.Item text={data?.schemaRecord.revocable ? "True" : "False"} color={"#eed535"} />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            title="EASScan"
            target={`https://base-goerli.easscan.org/schema/view/${data?.schemaRecord.uid}`}
            text="Open"
          />
          <Detail.Metadata.Link
            title="Base Goerli Subscription Contract"
            target={`https://goerli.basescan.org/address/${SubscriptionAddress}`}
            text="Open"
          />
        </Detail.Metadata>
      }
    />
  );
  {
    /* <Detail isLoading={isLoading} markdown={data || "Loading..."} /> */
  }
}
