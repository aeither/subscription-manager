import { Detail } from "@raycast/api";
import { EAS, SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { EASContractAddress, schemaUID } from "./utils/constants";
import { getSigner } from "./utils/signer";
import { ethers } from "ethers";
import { secureHeapUsed } from "crypto";

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
    const markdownString = "UID: " + schemaRecord.uid + "\n Schema: " + schemaRecord.schema;
    return markdownString;
  }, []);

  return <Detail isLoading={isLoading} markdown={data || "Not found"} />;
}
