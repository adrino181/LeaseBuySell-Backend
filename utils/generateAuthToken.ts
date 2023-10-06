import jwt from "jsonwebtoken";
const privateKey = process.env.JWT_KEY as string;
/**
  @param id
    Its user Id
  @param pid
    Its profile Id
  1) If user is first time then he will only get user token
  2) After completing his profile he will get access token to browse
*/
const generateAuthToken = async function (id: string, pid?: string) {
  const token = await jwt.sign(
    {
      //user id
      _id: id,
      //profile id
      ...(pid ? { _pid: pid } : {}),
    },
    privateKey,
    { expiresIn: "24h" }
  );
  return token;
};

export default generateAuthToken;
