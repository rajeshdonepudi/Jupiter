import * as yup from "yup";
import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";

const UserLookupModelSchema = yup.object().shape({
  id: yup.string().required("ID is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  fullName: yup.string().required("Full name is required"),
});

const KeyValuePairSchema = yup.object().shape({
  key: yup.string().required("Key is required"),
  value: yup.string().required("Value is required"),
});

const ManagePermissionValidationScheme = () => {
  return yup.object().shape({
    users: yup.array().of(UserLookupModelSchema).required("Users are required"),
    securityGroups: yup
      .array()
      .of(KeyValuePairSchema)
      .required("Security groups are required"),
    action: yup
      .mixed()
      .oneOf(Object.values(PermissionsActions))
      .required("Action is required"),
  });
};

export default ManagePermissionValidationScheme;
