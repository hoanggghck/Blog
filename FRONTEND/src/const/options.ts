import { USER_STATUS } from "./status";

export const USER_STATUS_OPTIONS = [
  { label: "Kích hoạt", value: USER_STATUS.ACTIVE },
  { label: "Vô hiệu hóa", value: USER_STATUS.INACTIVE },
  { label: "Cấm", value: USER_STATUS.BANNED },
];