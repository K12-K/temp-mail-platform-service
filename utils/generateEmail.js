// utils/generateEmail.js
import { v4 as uuidv4 } from "uuid";

export const generateEmail = () => {
  const id = uuidv4().slice(0, 8);
  return `${id}@mail.yourdomain.com`;
};