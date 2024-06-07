
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

//saves fid with color
export async function saveColor(fid: number, color: string) {
  const id = fid.toString();
  await redis.hset("colors", id, color);
}

//tracks fid with color 
export async function checkColor(fid: number): Promise<string | boolean> {
  const id = fid.toString();
  const color = await redis.hget("colors", id);
  return color !== null ? color : false;
}

//deltes fid with color use this function while testing 
export async function delColor(fid: number): Promise<boolean> {
  const id = fid.toString();
  const colorExists = await checkColor(fid); 
  if (typeof colorExists === 'string') {
    await redis.hdel("colors", id);
    return true;
  } else {
    return false;
  }
}