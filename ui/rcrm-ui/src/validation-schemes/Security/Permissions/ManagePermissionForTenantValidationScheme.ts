import * as yup from "yup";
import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";

const KeyValuePairSchema = yup.object().shape({
  key: yup.string().required("Key is required"),
  value: yup.string().required("Value is required"),
});

const ManagePermissionForTenantValidationScheme = (
  action: PermissionsActions
) => {
  switch (action) {
    case PermissionsActions.ASSIGN_PERMISSIONS:
    case PermissionsActions.REMOVE_PERMISSIONS:
      return yup.object().shape({
        tenants: yup
          .array()
          .of(KeyValuePairSchema)
          .required("Tenants are required"),
      });
  }
};

export default ManagePermissionForTenantValidationScheme;
