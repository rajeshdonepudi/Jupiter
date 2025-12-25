import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useTranslation } from "react-i18next";
import AppLoader from "./AppLoader";

type AppModalProps = {
  show: boolean;
  fullScreen?: boolean;
  handleClose: () => void; // Required for proper modal behavior
  handleOk?: () => void;
  modalTitle?: string;
  okButtonText?: string;
  children?: React.ReactNode;
  disableActions?: boolean;
  disableCancel?: boolean;
  disableOk?: boolean;
  disableCloseButton?: boolean;
  hideCancelButton?: boolean;
  hideOkButton?: boolean; // Add option to hide OK button
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(4),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(3),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose?: () => void; // Make optional to match usage
  disableCloseButton?: boolean;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, disableCloseButton, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        pr: onClose && !disableCloseButton ? 6 : 2, // Add padding for close button
        borderTop: (theme) => `4px solid ${theme.palette.primary.main}`, // Consistent primary color
        fontWeight: 600,
      }}
      {...other}
    >
      {children}
      {onClose && !disableCloseButton && (
        <IconButton
          aria-label="Close modal"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            "&:hover": {
              color: (theme) => theme.palette.grey[700],
              backgroundColor: (theme) => theme.palette.action.hover,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
}

export default function AppModal(props: AppModalProps) {
  const { t: commonLocale } = useTranslation();

  // Validate required props
  if (!props.handleClose) {
    console.warn("AppModal: handleClose is required for proper modal behavior");
  }

  const handleBackdropClick = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason === "backdropClick" && props.disableActions) {
      return; // Prevent closing on backdrop click when actions are disabled
    }
    props.handleClose?.();
  };

  return (
    <React.Suspense fallback={<AppLoader />}>
      <BootstrapDialog
        onClose={handleBackdropClick}
        aria-labelledby="customized-dialog-title"
        aria-describedby="customized-dialog-content"
        open={props.show}
        fullScreen={props.fullScreen}
        maxWidth={props.maxWidth ?? "sm"}
        fullWidth
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          disableCloseButton={props.disableActions || props.disableCloseButton}
          onClose={props.handleClose}
        >
          {props.modalTitle}
        </BootstrapDialogTitle>
        <DialogContent
          dividers
          id="customized-dialog-content"
          sx={{ minHeight: "100px" }} // Ensure minimum content area
        >
          {props.children}
        </DialogContent>
        {(!props.hideCancelButton ||
          (!props.hideOkButton && props.handleOk)) && (
          <DialogActions sx={{ gap: 1, p: 2 }}>
            {!props.hideCancelButton && (
              <Button
                disabled={props.disableActions || props.disableCancel}
                onClick={props.handleClose}
                variant="outlined"
                size="medium"
              >
                {commonLocale("cancel")}
              </Button>
            )}

            {!props.hideOkButton && props.handleOk && (
              <Button
                disabled={props.disableActions || props.disableOk}
                variant="contained"
                autoFocus
                onClick={props.handleOk}
                size="medium"
              >
                {props.okButtonText ?? "OK"}
              </Button>
            )}
          </DialogActions>
        )}
      </BootstrapDialog>
    </React.Suspense>
  );
}
