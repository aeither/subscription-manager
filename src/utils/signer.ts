import { getPreferenceValues } from "@raycast/api";
import { ethers } from "ethers";

interface Preferences {
  apiKey: string;
}

export function getSigner() {
  const preferences = getPreferenceValues<Preferences>();
  const apiKey = preferences.apiKey;
  const provider = new ethers.providers.JsonRpcProvider("https://sepolia.gateway.tenderly.co/");
  const signer = new ethers.Wallet(apiKey, provider);
  return signer;
}
