import { campaignState } from "@/atoms/campaignAtom";
import { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

const useCampaign = () => {
  const setCampaigns = useSetRecoilState(campaignState);
  const [token, setToken] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (user) {
      const token = user.token;
      setToken(token);
    }
  }, []);

  const getCampaigns = useCallback(async () => {
    if (token === "") return;
    try {
      const res = await fetch("https://inbox-peak.onrender.com/campaign", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.message) throw new Error("unauthorized user");

      setCampaigns(data);
      return data;
    } catch (error: any) {
      console.log("getCampaign Error", error);
      return error.message;
    }
  }, [setCampaigns, token]);

  const getCampaignById = useCallback(
    async (id: string) => {
      if (token === "") return;
      try {
        const res = await fetch(
          `https://inbox-peak.onrender.com/campaign/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log(data);
        return data;
      } catch (error) {
        console.log("getCampaignById Error", error);
      }
    },
    [token]
  );

  return { getCampaigns, getCampaignById };
};
export default useCampaign;
