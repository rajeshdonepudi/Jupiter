import * as yup from "yup";

const UserLookupModelSchema = yup.object().shape({
  id: yup.string().required("ID is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  fullName: yup.string().required("Full name is required"),
});

const TenantUsersSelectionValidationScheme = () => {
  return yup.object().shape({
    users: yup.array().of(UserLookupModelSchema).required("Users are required"),
  });
};

export default TenantUsersSelectionValidationScheme;
