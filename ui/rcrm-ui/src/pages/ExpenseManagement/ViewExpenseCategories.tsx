import AppDataGrid from "@/components/ui-components/AppDataGrid";
import AppLoader from "@/components/ui-components/AppLoader";
import AppModal from "@/components/ui-components/AppModal";
import { ExpenseManagementActions } from "@/enumerations/ExpenseManagement/ExpenseManagementActions";
import { AppModalState } from "@/models/Common/ModalState";
import {
  BasicExpenseCategory,
  GetExpenses,
} from "@/models/ExpenseManagement/GetExpenses";
import { Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { lazy, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AppPage from "@/components/ui-components/AppPage";
const EditOutlinedIcon = lazy(() => import("@mui/icons-material/EditOutlined"));
const DeleteOutlineOutlinedIcon = lazy(
  () => import("@mui/icons-material/DeleteOutlineOutlined")
);
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import AppSearchBar from "@/components/ui-components/AppSearchBar";
import AppConstants from "@/constants/constants";
import {
  useAddExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
  useGetAllExpenseCategoriesQuery,
  useUpdateExpenseCategoryMutation,
} from "@/services/ExpenseManagement/ExpenseCategoryService";
import UpsertExpenseCategoryForm from "@/components/features/ExpenseManagement/UpsertExpenseCategoryForm";
import { AddExpenseCategory } from "@/models/ExpenseManagement/AddExpenseCategory";
import { UpdateExpenseCategory } from "@/models/ExpenseManagement/UpdateExpenseCategory";
import AppPaper from "@/components/ui-components/AppPaper";

const ViewExpenseCategories = () => {
  const { t: commonLocale } = useTranslation();
  const formikRef = useRef<any>(null);
  const initialState: AppModalState = useMemo(() => {
    return {
      visible: false,
      title: undefined,
      actionId: 0,
      data: undefined,
      okButtonText: undefined,
    };
  }, []);

  const [addExpenseCategory] = useAddExpenseCategoryMutation();
  const [deleteExpenseCategory] = useDeleteExpenseCategoryMutation();
  const [updateExpenseCategory] = useUpdateExpenseCategoryMutation();

  const [filterExpenses, setExpensesFilter] = useState<GetExpenses>({
    page: 0,
    pageSize: 5,
    searchParams: null,
  });

  const [pageActionsState, setPageActionsState] =
    useState<AppModalState>(initialState);

  const { data, isFetching, refetch } =
    useGetAllExpenseCategoriesQuery(filterExpenses);

  const expenseCategoryData = useMemo(() => data?.data.items ?? [], [data]);

  const handleEditExpense = useCallback(
    (data: BasicExpenseCategory) => {
      setPageActionsState({
        actionId: ExpenseManagementActions.UPDATE_EXPENSE_CATEGORY,
        title: `${commonLocale("updateCategory")}`,
        data,
        visible: true,
        okButtonText: commonLocale("update"),
      });
      setTimeout(
        () =>
          formikRef.current?.setValues({
            id: data.id,
            name: data.name,
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
        actionId: ExpenseManagementActions.DELETE_EXPENSE_CATEGORY,
        title: commonLocale("deleteExpenseCategory"),
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
        field: "name",
        flex: 1,
        headerName: "Name",
        sortable: true,
      },
      {
        field: "description",
        flex: 1,
        headerName: "Description",
        sortable: false,
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
    [handleDeleteExpense, handleEditExpense]
  );

  const showMessage = useCallback(() => {
    switch (pageActionsState.actionId) {
      case ExpenseManagementActions.ADD_EXPENSE_CATEGORY:
        toast.success("Category added successfully.");
        break;
      case ExpenseManagementActions.UPDATE_EXPENSE_CATEGORY:
        toast.success("Category updated successfully.");
        break;
      case ExpenseManagementActions.DELETE_EXPENSE_CATEGORY:
        toast.success("Category deleted successfully.");
        break;
    }
  }, [pageActionsState.actionId]);

  const handleModalClose = useCallback(() => {
    formikRef.current?.resetForm();
    setPageActionsState(initialState);
  }, [initialState]);

  const handleSubmit = useCallback(
    (values: AddExpenseCategory | UpdateExpenseCategory) => {
      switch (pageActionsState.actionId) {
        case ExpenseManagementActions.ADD_EXPENSE_CATEGORY:
          addExpenseCategory(values)
            .unwrap()
            .then(showMessage)
            .finally(handleModalClose);
          break;
        case ExpenseManagementActions.UPDATE_EXPENSE_CATEGORY:
          updateExpenseCategory(values as UpdateExpenseCategory)
            .unwrap()
            .then(showMessage)
            .finally(handleModalClose);
          break;
      }
    },
    [
      addExpenseCategory,
      handleModalClose,
      pageActionsState.actionId,
      showMessage,
      updateExpenseCategory,
    ]
  );

  const renderUserForm = useCallback(
    (actionId: number) => (
      <UpsertExpenseCategoryForm
        formikRef={formikRef}
        onSubmit={handleSubmit}
        actionId={actionId}
      />
    ),
    [handleSubmit]
  );

  const getActionView = (actionId: number) => {
    switch (actionId) {
      case ExpenseManagementActions.DELETE_EXPENSE_CATEGORY:
        return (
          <Stack direction="column" alignItems="center">
            <Typography variant="body2">
              {commonLocale("confirmDeleteExpense")}
            </Typography>
          </Stack>
        );
      case ExpenseManagementActions.ADD_EXPENSE_CATEGORY:
      case ExpenseManagementActions.UPDATE_EXPENSE_CATEGORY:
        return renderUserForm(actionId);
    }
  };

  const handleOk = () => {
    switch (pageActionsState.actionId) {
      case ExpenseManagementActions.ADD_EXPENSE_CATEGORY:
      case ExpenseManagementActions.UPDATE_EXPENSE_CATEGORY:
        formikRef.current?.submitForm();
        break;
      case ExpenseManagementActions.DELETE_EXPENSE_CATEGORY:
        deleteExpenseCategory(pageActionsState.data.id)
          .unwrap()
          .then(showMessage)
          .finally(handleModalClose);
        break;
    }
  };

  const handleAddExpense = () => {
    setPageActionsState({
      actionId: ExpenseManagementActions.ADD_EXPENSE_CATEGORY,
      data: {},
      visible: true,
      title: "Add Expense Category",
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
            {commonLocale("addExpenseCategory")}
          </Button>
        </Stack>
      }
      title="Expense Categories"
      content={
        <AppPaper>
          <AppDataGrid
            columnsToHide={{ id: false }}
            records={expenseCategoryData}
            columns={columns}
            totalRecords={data?.data?.totalItems ?? 0}
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
            disableRowSelectionOnClick
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

export default ViewExpenseCategories;
