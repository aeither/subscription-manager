import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { SignerOrProvider } from "@ethereum-attestation-service/eas-sdk/dist/transaction";
import { Action, ActionPanel, Clipboard, Form, Toast, showToast } from "@raycast/api";
import { getSigner } from "./utils/signer";
import { EASContractAddress, schemaUID } from "./utils/constants";

type Values = {
  title: string;
  description: string;
  recipient: string;
  duration: Date;
  price: string;
};

export default function Command() {
  async function handleSubmit(values: Values) {
    console.log("Submitting...");

    const signer = getSigner();
    console.log("signer address", signer.address);

    const eas = new EAS(EASContractAddress);
    eas.connect(signer as unknown as SignerOrProvider);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder(
      "string title,string description,address recipient,uint256 duration,uint256 price"
    );

    const expirationTime = Math.floor(values.duration.getTime() / 1000); // Convert to UNIX timestamp
    const encodedData = schemaEncoder.encodeData([
      { name: "title", value: values.title, type: "string" },
      { name: "description", value: values.description, type: "string" },
      { name: "recipient", value: values.recipient, type: "address" },
      { name: "duration", value: expirationTime, type: "uint256" },
      { name: "price", value: Number(values.price), type: "uint256" },
    ]);

    const toast = await showToast({ style: Toast.Style.Animated, title: "Minting..." });
    try {
      const tx = await eas.attest({
        schema: schemaUID,
        data: {
          recipient: values.recipient,
          expirationTime: BigInt(expirationTime),
          revocable: true, // Be aware that if your schema is not revocable, this MUST be false
          data: encodedData,
        },
      });

      const newAttestationUID = await tx.wait();

      console.log("New attestation UID:", newAttestationUID);
      toast.style = Toast.Style.Success;
      toast.title = "New attestation UID:" + newAttestationUID;
      await Clipboard.copy(`https://base-goerli.easscan.org/attestation/view/${newAttestationUID}`);
    } catch (err: any) {
      toast.style = Toast.Style.Failure;
      toast.title = "Failed";
      toast.message = err.message;
    }

    // showToast({ title: "Submitted form", message: "See logs for submitted values" });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Description text="Create a new subscription" />
      <Form.TextField id="title" title="Title" defaultValue="Basic Plan" />
      <Form.TextArea id="description" title="Description" defaultValue="The plan include access to gated group..." />
      <Form.TextField id="recipient" title="Recipient" defaultValue="0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165" />
      <Form.Separator />
      <Form.DatePicker id="duration" title="Duration" defaultValue={new Date(Date.now() + 86400_000)} />
      <Form.TextField id="price" title="Price in USD" defaultValue="20" />
    </Form>
  );
}
