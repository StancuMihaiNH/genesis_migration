import { ulid } from "ulid";

export const newID = () => {
  return ulid();
};
