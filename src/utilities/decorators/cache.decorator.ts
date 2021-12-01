import { SetMetadata } from "@nestjs/common";
import { METADATA } from "../metadata";

export const Cacheable = () => {
  return SetMetadata(METADATA.BYK_CACHE_ACTIVE, true);
};
