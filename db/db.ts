import mongoose from "mongoose";

export default async function (url: string) {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.info("Connected BrokerDb Backend");
  } catch (error) {
    console.error("Something went wrong", error);
  }
}
