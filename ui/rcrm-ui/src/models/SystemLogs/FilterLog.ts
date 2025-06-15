import { PageParams } from "../Common/PageParams";

export interface FilterLog extends PageParams {
  resourceCodes: string[];
  controllerCodes: string[];
}
