import { Campaign } from "@/atoms/campaignAtom";
import CampaignChart from "@/components/CampaignChart";
import CampaignPerformance, {
  campaignRowData,
} from "@/components/CampaignPerformance";
import Spinner from "@/components/Spinner";
import useCampaign from "@/hooks/useCampaign";
import { Divider } from "@mantine/core";
import moment from "moment";
import { useEffect, useState } from "react";

type AllCampaignsProps = {};

const AllCampaigns: React.FC<AllCampaignsProps> = () => {
  const { getCampaigns } = useCampaign();
  const [campaigns, setCampaigns] = useState<Campaign[]>();
  const [error, setError] = useState(false);

  useEffect(() => {
    getCampaigns().then((res) => {
      if (res === "unauthorized user") return setError(true);
      setCampaigns(res);
    });
  }, [getCampaigns]);

  const data: campaignRowData[] = [];

  campaigns?.map((campaign) => {
    const formatted_data = {
      id: campaign.campaignID,
      email_sent: {
        rate: Number(campaign.email_sent.rate),
        percentage: Number(campaign.bounce_rate.percentage),
      },
      subject: campaign.subject,
      inbox_rate: {
        rate: Number(campaign.inbox_rate.rate),
        percentage: Number(campaign.bounce_rate.percentage),
      },
      open_rate: {
        rate: Number(campaign.open_rate.rate),
        percentage: Number(campaign.bounce_rate.percentage),
      },
      bounce_rate: {
        rate: Number(campaign.bounce_rate.rate),
        percentage: Number(campaign.bounce_rate.percentage),
      },
      date: moment(campaign.createdAt).format("DD-MM-YYYY"),
    };
    data.push(formatted_data);
  });

  if (error) {
    return (
      <div className="flex justify-center h-[100%] items-center">
        <h2 className="font-bold">UNAUTHORIZED USER</h2>
      </div>
    );
  }

  if (data.length === 0) return <Spinner />;

  return (
    <section>
      <CampaignChart />
      <Divider />
      <article className="mt-6">
        <CampaignPerformance data={data} />
      </article>
    </section>
  );
};

export default AllCampaigns;
