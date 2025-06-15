import { Button, ButtonProps } from "@mui/material";

interface AppButtonProps extends Omit<ButtonProps, "size"> {
  width?: string;
  size?: ButtonProps["size"];
}

const AppButton: React.FC<AppButtonProps> = ({
  width = "100%",
  size = "large",
  type = "button",
  variant = "contained",
  ...props
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      type={type}
      sx={{ width }}
      {...props}
    />
  );
};

export default AppButton;
