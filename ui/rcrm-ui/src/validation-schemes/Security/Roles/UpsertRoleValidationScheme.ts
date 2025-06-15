import { RoleActions } from "@/enumerations/Security/Roles/role-actions.enum";
import { UpsertRoleModel } from "@/models/Security/Roles/UpsertRoleModel";
import * as yup from "yup";

export const UpsertRoleValidationScheme = (action: RoleActions) => {
  switch (action) {
    case RoleActions.ADD_ROLE:
    case RoleActions.UPDATE_ROLE:
      return yup.object<UpsertRoleModel>({
        name: yup.string().required("Name is required"),
      });
  }
};
