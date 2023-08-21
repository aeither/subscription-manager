import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { Action, ActionPanel, Form, showToast } from "@raycast/api";
import { getSigner } from "./utils/signer";

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26

type Values = {
  textfield: string;
  textarea: string;
  datepicker: Date;
  checkbox: boolean;
  dropdown: string;
  tokeneditor: string[];
};

export default function Command() {
  async function handleSubmit(values: Values) {
    console.log("🚀 ~ file: create.tsx:20 ~ handleSubmit ~ values:", values);
    console.log("button submitting...");

    // const signer = getSigner();
    // console.log("signer address", signer.address);

    // const eas = new EAS(EASContractAddress);
    // eas.connect(signer as unknown as SignerOrProvider);

    // // Initialize SchemaEncoder with the schema string
    // const schemaEncoder = new SchemaEncoder("uint256 eventId, uint8 voteIndex");
    // const encodedData = schemaEncoder.encodeData([
    //   { name: "eventId", value: 1, type: "uint256" },
    //   { name: "voteIndex", value: 1, type: "uint8" },
    // ]);

    // const schemaUID = "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995";

    // const tx = await eas.attest({
    //   schema: schemaUID,
    //   data: {
    //     recipient: "0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165",
    //     expirationTime: BigInt(0),
    //     revocable: true, // Be aware that if your schema is not revocable, this MUST be false
    //     data: encodedData,
    //   },
    // });

    // const newAttestationUID = await tx.wait();

    // console.log("New attestation UID:", newAttestationUID);
    showToast({ title: "Submitted form", message: "See logs for submitted values" });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="This form showcases all available form elements." />
      <Form.TextField id="title" title="Title" defaultValue="Basic Plan" />
      <Form.TextArea id="description" title="Description" defaultValue="The plan include access to gated group..." />
      <Form.Separator />
      <Form.TextField id="duration" title="Duration" defaultValue="30 Days" />
    </Form>
  );
}
