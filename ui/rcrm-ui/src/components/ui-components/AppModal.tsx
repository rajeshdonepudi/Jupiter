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
  handleClose?: () => void;
  handleOk?: () => void;
  modalTitle?: string;
  okButtonText?: string;
  children?: React.ReactNode;
  disableActions?: boolean;
  disableCancel?: boolean;
  disableOk?: boolean;
  disableCloseButton?: boolean;
  hideCancelButton?: boolean;
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
  onClose: () => void;
  disableCloseButton?: boolean;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: 2,
        borderTop: (theme) =>
          `8px solid ${
            theme.palette.mode === "light"
              ? theme.palette.primary.main // Use primary color for light theme
              : theme.palette.secondary.main // Use secondary color for dark theme
          }`,
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          disabled={props.disableCloseButton}
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function AppModal(props: AppModalProps) {
  const { t: commonLocale } = useTranslation();
  return (
    <React.Suspense fallback={<AppLoader />}>
      <BootstrapDialog
        onClose={props?.handleClose}
        aria-labelledby="customized-dialog-title"
        open={props?.show}
        fullScreen={props.fullScreen}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          disableCloseButton={props.disableActions || props.disableCloseButton}
          onClose={props.handleClose as any}
        >
          {props.modalTitle}
        </BootstrapDialogTitle>
        <DialogContent dividers>{props?.children}</DialogContent>
        <DialogActions>
          {!props.hideCancelButton && (
            <Button
              disabled={props.disableActions || props.disableCancel}
              onClick={props?.handleClose}
              variant="outlined"
            >
              {commonLocale("cancel")}
            </Button>
          )}

          <Button
            disabled={props.disableActions || props.disableOk}
            variant="contained"
            autoFocus
            onClick={props?.handleOk}
          >
            {props?.okButtonText ?? "OK"}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Suspense>
  );
}
