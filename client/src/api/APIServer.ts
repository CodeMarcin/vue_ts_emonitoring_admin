import axios from "axios";

export const APIserver = axios.create({ baseURL: "http://localhost:8000" });
