import { SecurityGroupsActions } from "@/enumerations/Security/SecurityGroups/security-groups-actions.enum";
import { UpsertSecurityGroupModel } from "@/models/Security/SecurityGroups/UpsertSecurityGroupModel";
import * as yup from "yup";

const UpsertSecurityGroupValidationScheme = (action: SecurityGroupsActions) => {
  switch (action) {
    case SecurityGroupsActions.ADD_SECURITY_GROUP:
    case SecurityGroupsActions.UPDATE_SECURITY_GROUP:
      return yup.object<UpsertSecurityGroupModel>({
        name: yup.string().required("Name is required"),
      });
  }
};

export default UpsertSecurityGroupValidationScheme;
