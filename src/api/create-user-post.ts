import { api } from "./api";
type messageParams = {
  content: string;
  timelinedOwnerId: string;
};

export async function createUserPost({
  content,
  timelinedOwnerId,
}: messageParams): Promise<any> {
  const chatMessageResponse = await api.post("/feed", {
    timelinedOwnerId,
    content,
  });
  return chatMessageResponse;
}
