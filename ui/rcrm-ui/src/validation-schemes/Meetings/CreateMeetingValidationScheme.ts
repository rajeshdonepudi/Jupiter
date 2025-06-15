import * as yup from "yup";

const CreateMeetingValidationScheme = () => {
  return yup.object({
    name: yup
      .string()
      .email("Enter meeting name")
      .required("Email is required"),
  });
};

export default CreateMeetingValidationScheme;
