import { Action, ActionPanel, Detail, Form, Grid, getPreferenceValues } from "@raycast/api";
import "cross-fetch/polyfill";
import { formatEther, http, parseEther } from "viem";
import { baseGoerli } from "viem/chains";

import { createWalletClient, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { SubscriptionAddress } from "./utils/constants";
import { subscriptionAbi } from "./utils/subscriptionAbi";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const apiKey = preferences.apiKey;
  const account = privateKeyToAccount(apiKey as `0x${string}`);

  const handleSubmit = async () => {
    const client = createWalletClient({
      account,
      chain: baseGoerli,
      transport: http(),
    }).extend(publicActions);

    const { result, request } = await client.simulateContract({
      address: SubscriptionAddress,
      abi: subscriptionAbi,
      functionName: "subscribe",
      value: parseEther("0.0001"),
    });
    console.log("🚀 ~ file: subscribe.tsx:37 ~ getInfo ~ result:", result, request);

    // const accountBalance = await client.getBalance({ address: account.address });
    // const balanceAsEther = formatEther(accountBalance);

    // console.log("🚀 ~ file: subscribe.tsx:29 ~ getInfo ~ account.address:", account.address);
    // console.log("🚀 ~ file: subscribe.tsx:13 ~ getInfo ~ accountBalance:", balanceAsEther);
  };

  // 2,592,000,000
  return (
    <Grid columns={3}>
      <Grid.Item
        content="⭐️"
        title="Starter Plan"
        actions={
          <ActionPanel>
            <Action.SubmitForm onSubmit={handleSubmit} />
          </ActionPanel>
        }
      />
      <Grid.Item
        content="🌟"
        title="Premium Plan"
        actions={
          <ActionPanel>
            <Action.CopyToClipboard content="👋" />
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
