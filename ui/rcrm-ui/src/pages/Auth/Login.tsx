import { useFormik } from "formik";
import LoginValidationScheme from "@/validation-schemes/Account/LoginValidationScheme";
import { useLoginMutation } from "@services/Auth/AccountService";
import { LoginResponse } from "../../models/Account/LoginResponse";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "@feature-components/Account/LoginForm";
import { selectAuth, login as loginUser } from "../../store/Slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import AuthUtilities from "@/utilities/AuthUtilities";
import { useState } from "react";
import { ToastService } from "@/services/Common/ToastService";
import { ApiResponse } from "@/models/Common/ApiResponse";
import { ErrorResponse } from "@/models/Common/ErrorResponse";

const Login = () => {
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  // Get the `from` location from the state (default to "/secure/dashboard")
  const from = location.state?.from?.pathname || "/secure/dashboard";

  const handleForm = useFormik({
    initialValues: {
      email: "rajeshdonepudi1@mailinator.com",
      password: "@RxD@123",
    },
    validationSchema: LoginValidationScheme,
    onSubmit: (payload) => {
      setIsLoading(true);
      login(payload)
        .unwrap()
        .then((res) => {
          // Save the user data and login status
          AuthUtilities.loginUser(res.data as LoginResponse);
          dispatch(loginUser(res.data as LoginResponse));

          setIsLoading(false);

          // Navigate to the `from` location or default to dashboard
          navigate(from, {
            replace: true,
          });
        })
        .catch((res: ApiResponse<ErrorResponse>) => {
          ToastService.showMessage(res.data.message);
          setIsLoading(false);
        });
    },
  });

  return <LoginForm loading={isLoading} formik={handleForm} />;
};

export default Login;
