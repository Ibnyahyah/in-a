import { GetServerSidePropsContext } from "next";
import { getSession, signOut } from "next-auth/react";

import { Campaign } from "@/atoms/campaignAtom";
import CampaignPerformance, {
  campaignRowData,
} from "@/components/CampaignPerformance";
import Spinner from "@/components/Spinner";
import useCampaign from "@/hooks/useCampaign";
import { Divider } from "@mantine/core";
import moment from "moment";
import { useEffect, useState } from "react";

type user = {
  username: String;
  first_name: String;
};

export default function Home() {
  const { getCampaigns } = useCampaign();
  const [campaigns, setCampaigns] = useState<Campaign[]>();
  const [error, setError] = useState(false);
  const [user, setUser] = useState<user>();

  useEffect(() => {
    var user = JSON.parse(localStorage.getItem("user") as string);
    if (user == null || user == undefined) {
      signOut();
      return;
    }
    setUser(user);
  }, [setUser]);

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
      email_sent: campaign.email_sent,
      subject: campaign.subject,
      inbox_rate: campaign.inbox_rate,
      open_rate: campaign.open_rate,
      bounce_rate: campaign.bounce_rate,
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
  // const { data: session, status } = useSession();
  // console.log(session);
  return (
    <section>
      <div className="py-10">
        <h2 className="font-bold text-[50px]">
          Welcome Back {user?.first_name},
        </h2>
        <p>Let&#39;s get to work. Manage your campaigns</p>
      </div>
      <Divider />
      <article className="mt-6">
        <CampaignPerformance data={data} />
      </article>
    </section>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}
