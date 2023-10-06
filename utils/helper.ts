import { ObjectId } from "mongodb";
export const randHex = () => Math.floor(100000 + Math.random() * 900000);

export const isValidId = (id: string) => ObjectId.isValid(id); //true
