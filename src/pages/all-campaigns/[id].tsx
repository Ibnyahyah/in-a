import { Campaign, campaignState } from "@/atoms/campaignAtom";
import CountryChart from "@/components/CountryChart";
import CreateCampaign, { CampaignValues } from "@/components/CreateCampaign";
import OtherChart from "@/components/OtherChart";
import Spinner from "@/components/Spinner";
import { storage } from "@/config";
import sendRequest from "@/handler";
import useCampaign from "@/hooks/useCampaign";
import {
  Button,
  Group,
  Loader,
  Modal,
  Select,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconPlayerPlay } from "@tabler/icons-react";
import { IconInfoCircle, IconPlayerPause } from "@tabler/icons-react";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadString,
} from "firebase/storage";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";

import { useRecoilValue } from "recoil";

type CampaignIdProps = {};

const CampaignId: React.FC<CampaignIdProps> = () => {
  const router = useRouter();
  const { id } = router.query;
  const campaigns = useRecoilValue(campaignState);
  const [campaign, setCampaign] = useState<Campaign>();
  const [opened, setOpened] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null | string>(null);
  const [csvRows, setCsvRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [token, setToken] = useState("");
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    const token = user.token;
    setToken(token);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    const token = user.token;
    setToken(token);
  }, []);

  const { getCampaignById } = useCampaign();

  const campaignById = useMemo(() => {
    return campaigns.find((campaign) => campaign.campaignID === id);
  }, [campaigns, id]);

  useEffect(() => {
    if (campaignById) {
      setCampaign(campaignById);
    } else if (campaigns.length === 0 && id !== undefined) {
      getCampaignById(id as string).then((res) => setCampaign(res));
    }
  }, [campaignById, campaigns.length, getCampaignById, id]);

  useEffect(() => {
    setCsvFile(campaign?.uploaded_csv!);
  }, [campaign?.uploaded_csv]);

  useEffect(() => {
    setCsvRows(+campaign?.total_emails_in_csv_file!);
  }, [campaign?.total_emails_in_csv_file]);

  if (campaign === undefined) return <Spinner />;

  const first = {
    "Sender's Name": campaign.sender_name,
    "Sender's Email": campaign.sender_email,
    Subject: campaign.subject,
    "Email Sent": campaign.email_sent.rate.toLocaleString(),
  };

  const second = {
    Sent: campaign.email_sent.percentage.toFixed(2),
    "Open Rate": campaign.open_rate.percentage.toFixed(2),
    "Inbox Rate": campaign.inbox_rate.percentage.toFixed(2),
    "Bounce Rate": campaign.bounce_rate.rate.toFixed(2),
    "unsubscribe Rate": campaign.unsubscribe.percentage.toFixed(2),
    "Click Rate": campaign.click_rate.percentage.toFixed(2),
    "Spam Rate": campaign.spam_rate.percentage.toFixed(2),
    "Total recipients": campaign.total_recipients.percentage.toFixed(2),
  };

  const formValues = {
    csv: csvFile,
    sender_name: campaign.sender_name,
    sender_email: campaign.sender_email,
    open_rate: +campaign.open_rate.rate,
    bounce_rate: +campaign.bounce_rate.rate,
    unsubscribe: +campaign.unsubscribe.rate,
    email_sent: +campaign.email_sent.rate,
    subject: campaign.subject,
    inbox_rate: +campaign.inbox_rate.rate,
    country: [],
    browser_type: [],
    source_of_traffic: [],
  } as CampaignValues;

  const csv_file = (csv_file: File | null) => {
    // setCsvFile(csv_file);
  };

  const row_of_csv = (csv_row: number) => {
    setCsvRows(csv_row);
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
      return alert("make sure all fields are valid");
    }

    try {
      setLoading(true);
      if (typeof csv === "string") {
        const data = {
          uploaded_csv: csv,
          campaignID: campaign.campaignID,
          total_emails_in_csv_file: csvRows,
          ...values,
        };

        const res = await sendRequest(
          "PATCH",
          data,
          token,
          `campaign/update-campaign/${campaign._id}`
        );
        showNotification({
          message: res.message,
          autoClose: 2500,
          color: "blue",
        });
        setLoading(false);
        setOpened(false);
        return;
      } else {
        const csvRef = ref(storage, `campaigns/${id}/csv`);
        await uploadBytesResumable(csvRef, csv);
        const downloadURL = await getDownloadURL(csvRef);

        const data = {
          uploaded_csv: downloadURL,
          campaignID: campaign.campaignID,
          total_emails_in_csv_file: csvRows,
          ...values,
        };

        const res = await sendRequest(
          "PATCH",
          data,
          token,
          `campaign/update-campaign/${campaign._id}`
        );
        showNotification({
          message: res.message,
          autoClose: 2500,
          color: "blue",
        });
        setLoading(false);
        setOpened(false);
        return;
      }
    } catch (error) {
      console.log("updateCampaign Error", error);
      setLoading(false);
    }
  };

  const deleteCampaignRequest = async () => {
    setOpenDelete(true);
  };

  const deleteCampaignHandler = async () => {
    setLoadingDelete(true);
    const response = await fetch(
      `https://inbox-peak.cyclic.app/campaign/delete-campaign/${campaign.campaignID}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const res = await response.json();
    alert(res.message);
    setLoadingDelete(false);
    router.push("/all-campaigns");
  };

  const playAndPause = async () => {
    await sendRequest(
      "PATCH",
      "",
      token,
      `campaign/pause-or-play/${campaign._id}`
    )
      .then((res) => {
        showNotification({
          message: res.message,
          autoClose: 2500,
          color: "blue",
        });
        window.location.reload();
      })
      .catch((err) => {
        showNotification({
          message: err.message,
          autoClose: 2500,
          color: "red",
        });
      });
  };

  return (
    <>
      <Modal
        opened={openDelete}
        onClose={() => setOpenDelete(false)}
        size="auto"
      >
        <Text className="text-[20px]">
          Do you want to delete this campaign?
        </Text>
        <Button
          fullWidth
          className="bg-[#1c7ed6] mt-4 opacity-100 hover:opacity-75"
          onClick={deleteCampaignHandler}
          loading={loadingDelete}
        >
          Delete
        </Button>
      </Modal>

      <>
        <Modal size="xl" opened={opened} onClose={() => setOpened(false)}>
          <CreateCampaign
            submitHandler={submitHandler}
            row_of_csv={row_of_csv}
            loading={loading}
            title="Edit Campaign"
            formValues={formValues}
            csv_file={csv_file}
            trafficData={campaign.source_of_traffic}
            browserData={campaign.browser_type}
            countryData={campaign.country}
            csv_rows={csvRows}
          />
        </Modal>

        <Group position="center" className="no__print">
          <Button onClick={() => setOpened(true)}>Open Modal</Button>
        </Group>
      </>

      <section>
        <div className="flex justify-between no__print">
          <h2 className="font-bold text-[25px]">Campaign Analytics</h2>
          <Select
            placeholder="Pick one"
            data={[
              { value: "react", label: "React" },
              { value: "ng", label: "Angular" },
              { value: "svelte", label: "Svelte" },
              { value: "vue", label: "Vue" },
            ]}
          />
        </div>

        <aside className="flex items-center mt-10 justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-[20px]">
              Campaign Id:{" "}
              <span className="font-bold">{campaign.campaignID}</span>
            </h1>

            <div className="cursor-pointer no__print " onClick={playAndPause}>
              {campaign.running ? (
                <IconPlayerPause stroke={1.5} size="1.5rem" />
              ) : (
                <IconPlayerPlay stroke={1.5} size="1.2rem" />
              )}
            </div>
          </div>

          <div className="flex gap-4 no__print">
            <Button
              className="w-[5.5rem]"
              variant="outline"
              onClick={() => setOpened(true)}
            >
              Edit
            </Button>

            <Button
              className="w-[5.5rem] bg-[#1c7ed6]"
              onClick={() => window.print()}
            >
              Export
            </Button>
          </div>
        </aside>

        <div className="mt-6">
          <h2>Delivery</h2>
          <article className="mt-2 flex items-center flex-wrap bg-[#fafafa] border justify-between">
            {Object.entries(second).map(([key, value], index) => (
              <aside
                key={index}
                className={`w-[210px] py-8 ml-2 px-2 ${
                  index === 3 ? "" : "border-r-[1px]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-[500]">{key}</h2>
                  <IconInfoCircle stroke={1.5} size="1.1rem" />
                </div>
                <h2 className="font-bold text-[20px] mt-3 text-[#10b981]">
                  {value}%
                </h2>
              </aside>
            ))}
          </article>
        </div>

        <div className="mt-4">
          <h2>Details</h2>
          <article
            className="mt-2 flex items-center flex-wrap bg-[#fafafa] border justify-around"
            style={{ overflowWrap: "anywhere" }}
          >
            {Object.entries(first).map(([key, value], index) => (
              <aside
                key={index}
                className={`w-[210px] my-6 py-5 px-2 ${
                  index === 3 ? "" : "border-r-[1px]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <h2 className="font-[500]">{key}:</h2>
                </div>
                <p className="font-[400] text-[18px] mt-4">{value}</p>
              </aside>
            ))}
          </article>
        </div>

        <SimpleGrid
          cols={1}
          className="items-center mt-10 w-[100%] px-8 no__print"
          spacing="lg"
          breakpoints={[{ minWidth: 980, cols: 2, spacing: "md" }]}
        >
          <CountryChart
            chartData={campaign.countries_percentage}
            header="Country"
          />
          <OtherChart chartData={campaign.countries_percentage} />
        </SimpleGrid>
        <div className="my-6 flex justify-between">
          <div className="flex gap-4 items-center">
            <p>
              Total Emails in CSV:{" "}
              <span className="font-bold">
                {Number(campaign.total_emails_in_csv_file).toLocaleString()}
              </span>
            </p>

            <Link
              className="bg-[#1c7ed6] p-2 rounded text-[#fff] hover:opacity-70 no__print"
              title="Download CSV file"
              href={campaign.uploaded_csv}
              onClick={(e) => {
                e.preventDefault();
                const downloadName = "inboxpeak.csv"; // Replace with your desired download name
                const link = document.createElement("a");
                link.href = (e.target as HTMLAnchorElement).href; // Cast e.target to HTMLAnchorElement
                link.setAttribute("download", downloadName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download
            </Link>
          </div>

          <Button
            color="red"
            className="w-[5.5rem] no__print"
            variant="outline"
            title="Delete campaign"
            onClick={deleteCampaignRequest}
          >
            Delete
          </Button>
        </div>
      </section>
    </>
  );
};
export default CampaignId;
