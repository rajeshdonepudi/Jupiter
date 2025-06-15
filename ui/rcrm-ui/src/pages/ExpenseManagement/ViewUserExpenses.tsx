import AppDataGrid from "@/components/ui-components/AppDataGrid";
import AppLoader from "@/components/ui-components/AppLoader";
import AppModal from "@/components/ui-components/AppModal";
import { ExpenseManagementActions } from "@/enumerations/ExpenseManagement/ExpenseManagementActions";
import { AppModalState } from "@/models/Common/ModalState";
import { GetExpenses } from "@/models/ExpenseManagement/GetExpenses";
import { UpdateExpense } from "@/models/ExpenseManagement/UpdateExpense";
import {
  useAddExpenseMutation,
  useDeleteExpenseMutation,
  useGetAllExpensesQuery,
  useUpdateExpenseMutation,
} from "@/services/ExpenseManagement/ExpenseService";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { lazy, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AddExpense } from "@/models/ExpenseManagement/AddExpense";
import AppPage from "@/components/ui-components/AppPage";
const EditOutlinedIcon = lazy(() => import("@mui/icons-material/EditOutlined"));
const ArrowForwardIcon = lazy(() => import("@mui/icons-material/ArrowForward"));
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
import AddIcon from "@mui/icons-material/Add";
import AddExpenseForm from "@/components/features/ExpenseManagement/UpsertExpenseForm";
import { toast } from "react-toastify";
import CurrencyUtilities from "@/utilities/CurrencyUtilities";
import AppSearchBar from "@/components/ui-components/AppSearchBar";
import AppConstants from "@/constants/constants";
import NavUtilities from "@/utilities/NavUtilities";
import { BasicExpenseDetail } from "@/models/ExpenseManagement/BasicExpenseDetail";
import AppPaper from "@/components/ui-components/AppPaper";

const ViewUserExpenses = () => {
  const navigate = useNavigate();
  const formikRef = useRef<any>(null);
  const [addExpense] = useAddExpenseMutation();
  const [deleteExpense] = useDeleteExpenseMutation();
  const [updateExpense] = useUpdateExpenseMutation();

  const { t: commonLocale } = useTranslation();

  const [filterExpenses, setExpensesFilter] = useState<GetExpenses>({
    page: 0,
    pageSize: 5,
    searchParams: null,
  });

  const initialState: AppModalState = useMemo(() => {
    return {
      visible: false,
      title: undefined,
      actionId: 0,
      data: undefined,
      okButtonText: undefined,
    };
  }, []);

  const [pageActionsState, setPageActionsState] =
    useState<AppModalState>(initialState);

  const { data, isFetching, refetch } = useGetAllExpensesQuery(filterExpenses);

  const expensesData = useMemo(() => data?.data.items ?? [], [data]);

  const handleEditExpense = useCallback(
    (data: BasicExpenseDetail) => {
      setPageActionsState({
        actionId: ExpenseManagementActions.UPDATE_EXPENSE,
        title: `${commonLocale("update")} ${commonLocale("user")}`,
        data,
        visible: true,
        okButtonText: commonLocale("update"),
      });
      setTimeout(
        () =>
          formikRef.current?.setValues({
            categoryId: data.category.id,
            type: data.expenseType.type,
            amount: data.amount,
            id: data.id,
            description: data.description,
          }),
        200
      );
    },
    [commonLocale]
  );

  const handleDeleteExpense = useCallback(
    (id: string) => {
      setPageActionsState({
        actionId: ExpenseManagementActions.DELETE_EXPENSE,
        title: commonLocale("deleteExpense"),
        data: { id },
        visible: true,
        okButtonText: commonLocale("delete"),
      });
    },
    [commonLocale]
  );

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "description",
        flex: 1,
        headerName: "Description",
        sortable: false,
      },
      {
        field: "amount",
        headerName: "Amount",
        type: "number",
        flex: 1,
        renderCell: (params) => {
          return CurrencyUtilities.formatIndianCurrency(params.row.amount);
        },
      },
      {
        field: "type",
        headerName: "Expense Type",
        flex: 1,
        renderCell: (params) => {
          return params.row.expenseType.name;
        },
      },
      {
        field: "categoryName",
        headerName: "Category",
        flex: 1,
        renderCell: (params) => {
          return params.row.category.name;
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams<any>) => (
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            sx={{ height: "100%" }}
          >
            <Tooltip title="View more">
              <IconButton
                onClick={() =>
                  navigate(
                    NavUtilities.ToSecureArea(
                      `expenses/view?expenseId=${params.row.id}`
                    )
                  )
                }
              >
                <ArrowForwardIcon sx={{ color: "darkgreen" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit expense">
              <IconButton onClick={() => handleEditExpense(params.row)}>
                <EditOutlinedIcon sx={{ color: "darkblue" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete expense">
              <IconButton onClick={() => handleDeleteExpense(params.row.id)}>
                <DeleteOutlineOutlinedIcon sx={{ color: "darkred" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [handleDeleteExpense, handleEditExpense, navigate]
  );

  const showMessage = useCallback(() => {
    switch (pageActionsState.actionId) {
      case ExpenseManagementActions.ADD_EXPENSE:
        toast.success("Expense added successfully.");
        break;
      case ExpenseManagementActions.UPDATE_EXPENSE:
        toast.success("Expense updated successfully.");
        break;
      case ExpenseManagementActions.DELETE_EXPENSE:
        toast.success("Expense deleted successfully.");
        break;
    }
  }, [pageActionsState.actionId]);

  const handleModalClose = useCallback(() => {
    formikRef.current?.resetForm();
    setPageActionsState(initialState);
  }, [initialState]);

  const handleSubmit = useCallback(
    (values: AddExpense | UpdateExpense) => {
      switch (pageActionsState.actionId) {
        case ExpenseManagementActions.ADD_EXPENSE:
          addExpense(values)
            .unwrap()
            .then(showMessage)
            .finally(handleModalClose);
          break;
        case ExpenseManagementActions.UPDATE_EXPENSE:
          updateExpense(values as UpdateExpense)
            .unwrap()
            .then(showMessage)
            .finally(handleModalClose);
          break;
      }
    },
    [
      addExpense,
      handleModalClose,
      pageActionsState.actionId,
      showMessage,
      updateExpense,
    ]
  );

  const renderUserForm = useCallback(
    (actionId: number) => (
      <AddExpenseForm
        formikRef={formikRef}
        onSubmit={handleSubmit}
        actionId={actionId}
      />
    ),
    [handleSubmit]
  );

  const getActionView = (actionId: number) => {
    switch (actionId) {
      case ExpenseManagementActions.DELETE_EXPENSE:
        return (
          <Stack direction="column" alignItems="center">
            <Typography variant="body2">
              {commonLocale("confirmDeleteExpense")}
            </Typography>
          </Stack>
        );
      case ExpenseManagementActions.ADD_EXPENSE:
      case ExpenseManagementActions.UPDATE_EXPENSE:
        return renderUserForm(actionId);
    }
  };

  const handleOk = () => {
    if (
      pageActionsState.actionId === ExpenseManagementActions.ADD_EXPENSE ||
      pageActionsState.actionId === ExpenseManagementActions.UPDATE_EXPENSE
    ) {
      formikRef.current?.submitForm();
    } else if (
      pageActionsState.actionId === ExpenseManagementActions.DELETE_EXPENSE
    ) {
      deleteExpense(pageActionsState.data.id)
        .unwrap()
        .then(showMessage)
        .finally(handleModalClose);
    }
  };

  const handleAddExpense = () => {
    setPageActionsState({
      actionId: ExpenseManagementActions.ADD_EXPENSE,
      data: {},
      visible: true,
      title: "Add Expense",
      okButtonText: "Add",
    });
  };

  return (
    <AppPage
      rightHeaderActions={
        <Stack direction={"row"} gap={AppConstants.layout.StandardSpacing}>
          <AppSearchBar
            value={filterExpenses.searchParams ?? ""}
            handleChange={(e) => {
              setExpensesFilter((prev) => {
                return {
                  ...prev,
                  searchParams: e.target.value,
                };
              });
            }}
            handleSubmit={() => {
              refetch();
            }}
          />
          <Button
            onClick={handleAddExpense}
            variant="contained"
            startIcon={<AddIcon />}
          >
            {commonLocale("addExpense")}
          </Button>
        </Stack>
      }
      title="My Expenses"
      content={
        <AppPaper>
          <AppDataGrid
            columnsToHide={{ id: false }}
            records={expensesData}
            columns={columns}
            totalRecords={data?.data?.totalItems ?? 0}
            disableRowSelectionOnClick={true}
            isFetching={isFetching}
            paginationState={filterExpenses}
            setPaginationState={(model) =>
              setExpensesFilter((prev) => ({
                ...prev,
                page: model.page,
                pageSize: model.pageSize,
              }))
            }
            setRowId={(row) => row.id}
            hasNextPage={data?.data?.isNextPage ?? false}
          />
          <AppModal
            modalTitle={pageActionsState.title}
            show={pageActionsState.visible}
            okButtonText={pageActionsState.okButtonText}
            handleOk={handleOk}
            handleClose={handleModalClose}
          >
            <>{getActionView(pageActionsState.actionId)}</>
          </AppModal>
        </AppPaper>
      }
    />
  );
};

export default ViewUserExpenses;
