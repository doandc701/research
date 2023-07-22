import { $VSProfiles } from "../controllers/WebHookController";
export async function handleShortHand(params: string) {
  if (!params) return;
  const profile = await $VSProfiles.getProfiles(params);
  if (profile.decoded["0"].name) return profile.decoded["0"].name;
  return params.slice(0, 6) + "..." + params.slice(-4);
}
