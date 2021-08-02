import { supabase } from "../supabaseApi";

export interface PostI {
  uuid: string;
  user_uuid: string;
  content: string;
  font_color?: string;
  background_color?: string;
  created_at: string;
}

export interface FeedPostI extends PostI {
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

export async function getFeedByUuid(uuid: string) {
  const { data, error, status } = await supabase
    .from<FeedPostI>("feed")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error && status !== 406) {
    throw error;
  }

  return data;
}
