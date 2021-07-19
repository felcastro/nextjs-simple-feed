import { supabase } from "../api";

export interface FeedPostI {
  uuid: string;
  content: string;
  font_color?: string;
  background_color?: string;
  created_at: string;
  owner_uuid: string;
  owner_username: string;
  owner_avatar_url: string;
}

export async function getFeed() {
  const { data, error, status } = await supabase
    .from<FeedPostI>("feed")
    .select("*")
    .order("created_at", { ascending: false });

  if (error && status !== 406) {
    throw error;
  }

  return data;
}
