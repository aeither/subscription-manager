
<img src="https://github.com/aeither/subscription-manager/assets/36173828/ae67987b-8e5d-4e81-93dc-632aefccb81d" alt="Logo" width="100%" >

# Subscription Manager

Manage customers subscriptions directly from Mac Launcher.

## Description

Subcription manager is a reliable subscription management tool that uses EAS to make sure subscriptions are fair and transparent and collect payments through smart contracts deployed to Base Goerli to cut down on fees and hold off congestion.

It is a Raycast extension to manage subscriptions easily from the Mac launcher. We leveraged Raycast, an tool that replace the native spotlight with extensible functionalities. 

## How it works

![Flow](https://github.com/aeither/subscription-manager/assets/36173828/280bb229-3444-4802-abf6-5580fcaa144b)


## Technology used

- TypeScript
- ethers
- viem
- Solidity
- EAS

## Deployed contracts

Subscription Smart contract on Base Goerli:

https://goerli.basescan.org/address/0x551138a2d0f4808b842f17a42556658ef50b637c

EAS Schema:

https://base-goerli.easscan.org/schema/view/0x83422a9c21920ff23e2ca62c3fbd52536c7d90798a6ea0e6926dcc82afc06050

## Instruction

The extension is not published in the store yet. To run it follow the following instructions. As Raycast is only available for Macs, it requires to have a Mac and Raycast installed from https://www.raycast.com.

```bash
npm install
```

```bash
npm run dev
```

## Screenshots

Menu

![menu](https://github.com/aeither/subscription-manager/assets/36173828/34ada430-b259-40f8-9a82-007b1d89746c)

Custom subscription

![custom](https://github.com/aeither/subscription-manager/assets/36173828/9938446f-b61a-4b48-a358-7784b393b3f7)

Subscribe

![subscribe](https://github.com/aeither/subscription-manager/assets/36173828/5b3eb253-75f2-45da-850c-6a460325df2d)

All subscriptions

![all](https://github.com/aeither/subscription-manager/assets/36173828/2e8b8fc9-af11-4d1f-8df9-34079a16a1f5)

