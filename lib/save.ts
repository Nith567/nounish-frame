
import redis from "./redis";

export async function saved(fid: number) {
    const id = fid.toString();
    await redis.hset("played", id, "true");
  }
  
  export async function checkPlayed(fid: number) {
    const id = fid.toString();
    const played = await redis.hget("played", id);
    if (played === "true") {
      return true;
    }
    return false;
  }

  export async function removePlayed(fid: number) {
    const id = fid.toString();
    await redis.hdel("played", id);
}