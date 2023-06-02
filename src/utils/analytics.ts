import axios from "axios";
import { getURLInApp } from "./utils";
import { RelayerResponse } from "../types/types";

export const track = async (event: string, scw?: string) => {
  try {
    const body = {
      event: event,
      scw: scw,
    };
    console.log(`${getURLInApp()}/api/v1/event`);
    const { data } = (await axios.post(`${getURLInApp()}/api/v1/event`, body, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=UTF-8",
      },
    })) as { data: RelayerResponse };
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error sending event: ", error.message);
    } else {
      console.log("unexpected error sending event: ", error);
    }
  }
};
