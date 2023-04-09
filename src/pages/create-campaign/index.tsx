import CreateCampaign, { CampaignValues } from "@/components/CreateCampaign";
import { storage } from "@/config";
import sendRequest from "@/handler";
import { showNotification } from "@mantine/notifications";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import { useEffect, useState } from "react";

type CreateCampaignIndexProps = {};

const CreateCampaignIndex: React.FC<CreateCampaignIndexProps> = () => {
  const [csvRows, setCsvRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    const token = user.token;
    setToken(token);
  }, []);

  const generateID = async () => {
    const id = `${Date.now().toString(36)}${Math.random()
      .toString(36)
      .substring(2, 4)}`;
    const data = `IB${id.slice(5).toUpperCase()}`;
    const encoder = new TextEncoder();
    const dataUint8 = encoder.encode(data);
    return crypto.subtle.digest("SHA-256", dataUint8).then((hash) => {
      const hashArray = Array.from(new Uint8Array(hash));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const uniqueId = `IP${hashHex.substring(0, 6)}`.toUpperCase();
      return uniqueId;
    });
  };

  const row_of_csv = (csv_row: number) => {
    setCsvRows(csv_row);
  };

  const csv_file = (csv_file: File | null) => {
    setCsvFile(csv_file);
  };

  const submitHandler = async ({ csv, ...values }: CampaignValues) => {
    if (csv === null) {
      return alert("Please select a CSV file");
    }

    if (
      values.sender_name.length < 4 ||
      values.subject.length < 4 ||
      values.browser_type.length === 0 ||
      values.country.length === 0 ||
      values.source_of_traffic.length === 0 ||
      values.open_rate < 0 ||
      values.bounce_rate < 0 ||
      values.unsubscribe < 0 ||
      values.email_sent < 0 ||
      values.inbox_rate < 0
    ) {
      return showNotification({
        message: "make sure all fields are valid",
        autoClose: 2500,
        color: "red",
      });
    }

    const id = await generateID();
    setLoading(true);

    try {
      const csvRef = ref(storage, `campaigns/${id}/csv`);
      await uploadBytesResumable(csvRef, csv);
      const downloadURL = await getDownloadURL(csvRef);

      const data = {
        campaignID: id,
        uploaded_csv: downloadURL,
        total_emails_in_csv_file: csvRows,
        ...values,
      };

      const res = await sendRequest(
        "POST",
        data,
        token,
        "campaign/create-campaign"
      );
      showNotification({
        message: res.message,
        autoClose: 2500,
        color: "blue",
      });
      setLoading(false);
    } catch (error) {
      console.log("createCampaign Error", error);
      setLoading(false);
    }
  };

  const formValues = {
    csv: csvFile,
    sender_name: "",
    sender_email: "",
    open_rate: 0,
    bounce_rate: 0,
    unsubscribe: 0,
    email_sent: 0,
    subject: "",
    inbox_rate: 0,
    country: [],
    browser_type: [],
    source_of_traffic: [],
  } as CampaignValues;

  return (
    <>
      <CreateCampaign
        submitHandler={submitHandler}
        row_of_csv={row_of_csv}
        loading={loading}
        title="Create your Campaign"
        formValues={formValues}
        csv_file={csv_file}
      />
    </>
  );
};
export default CreateCampaignIndex;
