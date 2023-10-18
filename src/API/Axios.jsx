import axios from "axios";
import { baseURL } from "./Api";
import Cookie from "cookie-universal";

const cookie = Cookie();
const token = cookie.get("solom");

export const Axios = axios.create({
  baseURL: baseURL,
  headers: { Authorization: `Token ${token}` },
});
