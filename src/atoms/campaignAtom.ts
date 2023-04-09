import { atom } from "recoil";

export type chType = {
  name: string;
  percentage: number;
};

export type Campaign = {
  bounce_rate: { rate: number; percentage: number };
  browser_type: string[];
  campaignID: string;
  country: string[];
  creator: string;
  email_sent: { rate: number; percentage: number };
  inbox_rate: { rate: number; percentage: number };
  open_rate: { rate: number; percentage: number };
  running: boolean;
  sender_email: string;
  sender_name: string;
  source_of_traffic: string[];
  subject: string;
  total_emails_in_csv_file: string;
  unsubscribe: { rate: number; percentage: number };
  uploaded_csv: string;
  __v: number;
  _id: string;
  createdAt: number;
  click_rate: { rate: number; percentage: number };
  spam_rate: { rate: number; percentage: number };
  total_recipients: { rate: number; percentage: number };
  recipient_reached: { rate: number; percentage: number };
  recipient_left: { rate: number; percentage: number };
  campaign_score: { rate: number; percentage: number };
  source_of_traffic_percentage: [chType];
  device_type_percentage: [chType];
  countries_percentage: [chType];
  sent: { rate: number; percentage: number };
};

// export interface CampaignState {
//   campaigns: Campaign[];
// }

export const campaignState = atom<Campaign[]>({
  key: "campaignState",
  default: [],
});
