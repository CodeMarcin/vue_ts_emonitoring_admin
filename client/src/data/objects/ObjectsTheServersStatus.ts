import { uuid } from "vue-uuid";
import type { BadgeType } from "@/components/parts/Badge/Badge.vue";
import LABELS from "../labels/LabelsTheServersStatus";

export type TypeStatus = typeof LABELS.LOADING | typeof LABELS.ONLINE | typeof LABELS.OFFLINE;
type TypeServer = "nodejs" | "database" | "mailsystem";

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
    serverType: "nodejs",
    label: LABELS.NODE_SERVER,
    icon: "ri-server-line",
    status: LABELS.LOADING,
    badgeType: "success",
    link: "https://api.github.com/users/mapbdqox", // PLACEHOLDER 
  },
  {
    id: uuid.v4(),
    serverType: "database",
    label: LABELS.DATA_BASE,
    icon: "ri-database-2-line",
    status: LABELS.LOADING,
    badgeType: "success",
    link: "https://reqres.in/api/users", // PLACEHOLDER
  },
  {
    id: uuid.v4(),
    serverType: "mailsystem",
    label: LABELS.MAIL_SYSTEM,
    icon: "ri-mail-send-line",
    status: LABELS.LOADING,
    badgeType: "success",
    link: "https://api.github.com/users/mapbox", // PLACEHOLDER
  },
];
