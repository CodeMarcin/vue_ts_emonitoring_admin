import axios from "axios";

export interface InterfaceData {
    data: [] | {}
}

export const APIserver = axios.create({ baseURL: "http://localhost:8000" });
