import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AppPage from "@/components/ui-components/AppPage";
import AppPaper from "@/components/ui-components/AppPaper";
import {
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import SelectPermissionsView from "@/components/features/Security/Permissions/SelectPermissionsView";
import AppConstants from "@/constants/constants";
import Grid from "@mui/material/Grid2";
import { KeyValuePair } from "@/models/Common/KeyValuePair";
import { AppModalState } from "@/models/Common/ModalState";
import { PermissionsActions } from "@/enumerations/Security/Permissions/permissions-actions.enum";
import {
  useGetAllPermissionsQuery,
  useManagePermissionsMutation,
} from "@/services/Security/PermissionService";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import ReviewPermissions from "@/components/features/Security/Permissions/ReviewPermissions";
import PermissionActionCards from "@/components/features/Security/Permissions/PermissionAction";
import PermissionAssignment from "@/components/features/Security/Permissions/PermissionAssignment";
import { AssignOrUnassignPermissionModel } from "@/models/Security/Permissions/AssignOrUnassignPermissionModel";
import ManagePermissionValidationScheme from "@/validation-schemes/Security/Permissions/ManagePermissionValidationScheme";
interface step {
  label: string;
  content: ReactNode;
}

export default function ManagePermissions() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPermissions, setSelectedPermissions] = useState<
    Record<string, KeyValuePair<string, string>[]>
  >({});
  const [pageActionsState, setPageActionsState] = useState<AppModalState>({
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  });

  const [managePermissions] = useManagePermissionsMutation();
  const { data: permissionsData, isLoading } = useGetAllPermissionsQuery(null);

  /** Toggle individual permission */
  const handleToggle = (
    groupId: string,
    permission: KeyValuePair<string, string>
  ) => {
    setSelectedPermissions((prev) => {
      const groupPermissions = prev[groupId] || [];
      const isAlreadySelected = groupPermissions.some(
        (item) => item.key === permission.key
      );

      const updatedPermissions = isAlreadySelected
        ? groupPermissions.filter((item) => item.key !== permission.key)
        : [...groupPermissions, permission];

      return {
        ...prev,
        [groupId]: updatedPermissions,
      };
    });
  };

  const handleSelectAll = (
    groupId: string,
    groupPermissions: KeyValuePair<string, string>[],
    isSelected: boolean
  ) => {
    setSelectedPermissions((prev) => {
      // If already selected, remove all permissions
      if (isSelected) {
        const updated = { ...prev };
        delete updated[groupId]; // Completely remove the group
        return updated;
      }

      // Otherwise, select all permissions in the group
      return {
        ...prev,
        [groupId]: groupPermissions,
      };
    });
  };

  const clearSelection = useCallback(() => {
    setSelectedPermissions({});
  }, []);

  const formikRef = useRef<any>(null);

  const showMessage = () => {
    switch (pageActionsState.actionId) {
      case PermissionsActions.ASSIGN_PERMISSIONS:
        toast("Permissions added successfully.");
        break;
      case PermissionsActions.REMOVE_PERMISSIONS:
        toast("Permissions removed successfully.");
        break;
    }
  };

  const handleModalClose = () => {
    formikRef?.current?.resetForm();
    setPageActionsState((prev: AppModalState) => {
      return {
        ...prev,
        visible: false,
        data: {},
        title: undefined,
        okButtonText: undefined,
        actionId: 0,
      };
    });
  };

  const formik = useFormik<AssignOrUnassignPermissionModel>({
    initialValues: {
      users: [],
      securityGroups: [],
      action: PermissionsActions.NotSpecified,
    },
    validationSchema: ManagePermissionValidationScheme(),
    validateOnBlur: true,
    onSubmit: (values: AssignOrUnassignPermissionModel, h) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = (values: AssignOrUnassignPermissionModel) => {
    switch (pageActionsState.actionId) {
      case PermissionsActions.ASSIGN_PERMISSIONS:
      case PermissionsActions.REMOVE_PERMISSIONS:
        managePermissions({
          users: values.users.map((x) => x.id),
          securityGroups: values.securityGroups.map((x) => x.value),
          action: pageActionsState.actionId,
          permissions: [], // selectedPermissions.map((x:any) => x.key),
        })
          .unwrap()
          .then(() => {
            showMessage();
          })
          .then(() => {
            handleModalClose();
          })
          .finally(() => {
            setSelectedPermissions({});
            formik.resetForm();
            handleReset();
          });
        break;
    }
  };

  const handleNext = (index: number) => {
    const isLastStep = index === stepperSteps.length - 1;
    if (isLastStep) {
      formik.submitForm();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const stepperSteps = useMemo(() => {
    const steps: step[] = [
      {
        label: "Select Permissions",
        content: (
          <SelectPermissionsView
            permissions={permissionsData?.data ?? []}
            isLoading={isLoading}
            onSelectAll={handleSelectAll}
            onToggle={handleToggle}
            selectedPermissions={selectedPermissions}
            onClearSelection={clearSelection}
          />
        ),
      },
      {
        label: "Assign",
        content: (
          <Stack gap={AppConstants.layout.StandardSpacing}>
            <PermissionAssignment
              securityGroups={formik.values.securityGroups}
              users={formik.values.users}
              formik={formik}
            />
          </Stack>
        ),
      },
      {
        label: "Review",
        content: (
          <ReviewPermissions
            tenantIds={formik.values.securityGroups.map((x) => x.value)}
            selectedPermissions={selectedPermissions}
          />
        ),
      },
      {
        label: "Action",
        content: (
          <Stack gap={AppConstants.layout.StandardSpacing}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Choose Action {pageActionsState.actionId}
            </Typography>

            <PermissionActionCards
              selected={pageActionsState.actionId}
              setSelected={function (
                value: SetStateAction<PermissionsActions>
              ): void {
                setPageActionsState((prev) => {
                  return {
                    ...prev,
                    actionId: Number(value),
                  };
                });
              }}
            />
          </Stack>
        ),
      },
    ];
    return steps;
  }, [selectedPermissions, formik]);

  const stepContentLayout = (index: number, content: ReactNode) => {
    return (
      <Grid container spacing={AppConstants.layout.StandardSpacing}>
        <Grid size={12}>{content}</Grid>
        <Grid size={12}>
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={index === 0}
              sx={{ minWidth: 120 }} // Ensures consistent button size
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={() => handleNext(index)}
              sx={{ minWidth: 120 }} // Ensures consistent button size
            >
              {index === stepperSteps.length - 1 ? "Finish" : "Continue"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    );
  };

  return (
    <AppPage
      content={
        <Stack spacing={AppConstants.layout.StandardSpacing}>
          <AppPaper>
            <Box sx={{ width: "100%" }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {stepperSteps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel onClick={() => setActiveStep(index)}>
                      {step.label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </AppPaper>
          <AppPaper>
            {stepContentLayout(activeStep, stepperSteps[activeStep].content)}
          </AppPaper>
        </Stack>
      }
    ></AppPage>
  );
}
