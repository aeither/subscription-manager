import { Action, ActionPanel, Detail, getPreferenceValues } from "@raycast/api";
import "cross-fetch/polyfill";
import { formatEther, http, parseAbi } from "viem";
import { mainnet, baseGoerli } from "viem/chains";

import { createWalletClient, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const apiKey = preferences.apiKey;
  const account = privateKeyToAccount(apiKey as `0x${string}`);

  const getInfo = async () => {
    const client = createWalletClient({
      account,
      chain: baseGoerli,
      transport: http(),
    }).extend(publicActions);

    // const { request } = await client.simulateContract({
    //   address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
    //   abi: parseAbi(["function mint(uint32) view returns (uint32)"]),
    //   functionName: "mint",
    //   args: [69420],
    //   account: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
    // });
    // const hash = await client.writeContract(request); // Wallet Action

    const accountBalance = await client.getBalance({ address: account.address });
    const balanceAsEther = formatEther(accountBalance);

    console.log("🚀 ~ file: subscribe.tsx:29 ~ getInfo ~ account.address:", account.address);
    console.log("🚀 ~ file: subscribe.tsx:13 ~ getInfo ~ accountBalance:", balanceAsEther);
  };
  return (
    <Detail
      markdown={"hello world"}
      actions={
        <ActionPanel>
          <Action title="Open Extension Preferences" onAction={getInfo} />
        </ActionPanel>
      }
    />
  );
}
