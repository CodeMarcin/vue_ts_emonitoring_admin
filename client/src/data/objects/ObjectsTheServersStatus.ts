import { uuid } from "vue-uuid";
import type { BadgeType } from "@/components/parts/Badge/Badge.vue";
import { LOADING, ONLINE, OFFLINE,  MAIL_SYSTEM } from "../labels/LabelsGlobal";

export type TypeStatus = typeof LOADING | typeof ONLINE | typeof OFFLINE;
type TypeServer = "mailsystem";

interface Server {
  id: string;
  serverType: TypeServer;
  label: string;
  icon: string;
  status: TypeStatus;
  badgeType: BadgeType;
  link: string;
}

export const OBJECT__SERVERS_STATUS: Server[] = [
  {
    id: uuid.v4(),
    serverType: "mailsystem",
    label: MAIL_SYSTEM,
    icon: "ri-mail-send-line",
    status: LOADING,
    badgeType: "success",
    link: import.meta.env.VITE_API_SERVER_STATUS,
  },
];
