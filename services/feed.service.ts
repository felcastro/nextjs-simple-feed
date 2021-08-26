import { supabase } from "../supabaseApi";

export interface PostI {
  uuid: string;
  user_uuid: string;
  parent_uuid?: string;
  content: string;
  comments_count: number;
  created_at: string;
}

export interface FeedPostI extends PostI {
  owner_uuid: string;
  owner_username: string;
  owner_avatar_url: string;
  isNew?: boolean;
}

export async function getFeed(startIndex = 0, parent_uuid = null) {
  const { data, error, status } = await supabase
    .from<FeedPostI>("feed")
    .select("*")
    .is("parent_uuid", null)
    .order("created_at", { ascending: false })
    .range(startIndex, startIndex + 9);

  if (error && status !== 406) {
    throw error;
  }

  return data;
}

export async function getFeedByParentPost(startIndex = 0, parent_uuid: string) {
  const { data, error, status } = await supabase
    .from<FeedPostI>("feed")
    .select("*")
    .eq("parent_uuid", parent_uuid)
    .order("created_at", { ascending: false })
    .range(startIndex, startIndex + 9);

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
