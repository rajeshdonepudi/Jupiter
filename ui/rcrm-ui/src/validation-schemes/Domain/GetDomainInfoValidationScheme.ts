import * as yup from "yup";

const DomainInfoValidationScheme = () => {
  return yup.object({
    domainName: yup
      .string()
      .required("Please enter domain name.")
      .matches(
        /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,6}$/,
        "Invalid domain name"
      ),
  });
};

export default DomainInfoValidationScheme;
