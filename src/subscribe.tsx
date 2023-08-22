import { Action, ActionPanel, Detail } from "@raycast/api";
import "cross-fetch/polyfill";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

export default function Command() {
  const getInfo = async () => {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(),
    });
    const blockNumber = await client.getBlockNumber();
    console.log("🚀 ~ file: subscribe.tsx:13 ~ getInfo ~ blockNumber:", blockNumber);
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
