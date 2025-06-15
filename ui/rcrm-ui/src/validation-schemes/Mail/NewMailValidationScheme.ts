import * as yup from "yup";

const userObject = yup.object().shape({
  email: yup.string(),
  fullName: yup.string(),
  id: yup.string().required("Please specify at least one recipient"),
});

const NewMailValidationScheme = () => {
  return yup.object({
    toRecipients: yup
      .array(userObject)
      .required("Please specify at least one recipient"),
    ccRecipients: yup.array(userObject),
    bccRecipients: yup.array(userObject),
    subject: yup.string(),
    body: yup.string(),
  });
};

export default NewMailValidationScheme;
