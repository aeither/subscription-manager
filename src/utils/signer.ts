import { getPreferenceValues } from "@raycast/api";
import { ethers } from "ethers";
import { RPC_URL } from "./constants";

interface Preferences {
  apiKey: string;
}

export function getSigner() {
  const preferences = getPreferenceValues<Preferences>();
  const apiKey = preferences.apiKey;
  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(apiKey, provider);
  return signer;
}
