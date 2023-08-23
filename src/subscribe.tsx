import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { Action, ActionPanel, Grid, Toast, getPreferenceValues, showToast } from "@raycast/api";
import "cross-fetch/polyfill";
import { createWalletClient, http, parseEther, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseGoerli } from "viem/chains";
import { EASContractAddress, SubscriptionAddress, schemaUID } from "./utils/constants";
import { getSigner } from "./utils/signer";
import { subscriptionAbi } from "./utils/subscriptionAbi";

async function easMint(recipient: string, price: string) {
  const signer = getSigner();
  const eas = new EAS(EASContractAddress);
  eas.connect(signer as unknown as SignerOrProvider);

  const schemaEncoder = new SchemaEncoder(
    "string title,string description,address recipient,uint256 duration,uint256 price"
  );

  const MonthlySubUNIX = new Date(Date.now() + 2_592_000_000).getTime() / 1000; // Convert to UNIX timestamp
  const expirationTime = Math.floor(MonthlySubUNIX);
  const encodedData = schemaEncoder.encodeData([
    { name: "title", value: "Starter Plan", type: "string" },
    { name: "description", value: "Access to basic benefits", type: "string" },
    { name: "recipient", value: recipient, type: "address" },
    { name: "duration", value: expirationTime, type: "uint256" },
    { name: "price", value: Number(price), type: "uint256" },
  ]);

  try {
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: recipient,
        expirationTime: BigInt(expirationTime),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();

    console.log("New attestation UID:", newAttestationUID);
    return { msg: newAttestationUID, status: 1 };
  } catch (err: any) {
    return { msg: err.message, status: 0 };
  }
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const apiKey = preferences.apiKey;
  const account = privateKeyToAccount(apiKey as `0x${string}`);

  const handleSubmit = async () => {
    const toast = await showToast({ style: Toast.Style.Animated, title: "Minting..." });

    const client = createWalletClient({
      account,
      chain: baseGoerli,
      transport: http(),
    }).extend(publicActions);

    // Pay ETH for subscription
    const { request } = await client.simulateContract({
      address: SubscriptionAddress,
      abi: subscriptionAbi,
      functionName: "subscribe",
      value: parseEther("0.0001"),
    });
    const hash = await client.writeContract(request);
    console.log("🚀 ~ file: subscribe.tsx:78 ~ handleSubmit ~ hash:", hash);

    // Mint eas attestation
    // const easMintResponse: { msg: string; status: number } = await easMint(client.account.address, "0.0001");
    // if (easMintResponse.status) {
    //   toast.style = Toast.Style.Success;
    //   toast.title = "New attestation UID:" + easMintResponse.msg;
    //   await Clipboard.copy(`https://base-goerli.easscan.org/attestation/view/${easMintResponse.msg}`);
    // } else {
    //   toast.style = Toast.Style.Failure;
    //   toast.title = "Failed";
    //   toast.message = easMintResponse.msg;
    // }

    // const accountBalance = await client.getBalance({ address: account.address });
    // const balanceAsEther = formatEther(accountBalance);

    // console.log("🚀 ~ file: subscribe.tsx:29 ~ getInfo ~ account.address:", account.address);
    // console.log("🚀 ~ file: subscribe.tsx:13 ~ getInfo ~ accountBalance:", balanceAsEther);
  };

  return (
    <Grid columns={3}>
      <Grid.Item
        content="⭐️"
        title="Starter Plan"
        actions={
          <ActionPanel>
            <Action.SubmitForm title="Subscribe" onSubmit={handleSubmit} />
          </ActionPanel>
        }
      />
      <Grid.Item
        content="🌟"
        title="Premium Plan"
        actions={
          <ActionPanel>
            <Action.CopyToClipboard title="Subscribe" content="👋" />
          </ActionPanel>
        }
      />
      <Grid.Item
        content="🤩"
        title="Ultra Plan"
        actions={
          <ActionPanel>
            <Action.CopyToClipboard content="👋" />
          </ActionPanel>
        }
      />
    </Grid>

    // <Form
    //   actions={
    //     <ActionPanel>
    //       <Action.SubmitForm onSubmit={handleSubmit} />
    //     </ActionPanel>
    //   }
    // >
    //   <Form.Description text="Subscribe for 30 days to basic Plan" />
    //   <Form.TextField id="price" title="Price in ETH" defaultValue="20" />
    // </Form>
  );
}
