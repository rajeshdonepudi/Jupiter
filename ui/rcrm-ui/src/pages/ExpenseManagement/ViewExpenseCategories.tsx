import { lazy, useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import AppPage from "@/components/ui-components/AppPage";
import AppModal from "@/components/ui-components/AppModal";
import AppPaper from "@/components/ui-components/AppPaper";
import AppSearchBar from "@/components/ui-components/AppSearchBar";

import { usePaginatedGrid } from "@/hooks/usePaginatedGrid";

import {
  useAddExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
  useGetAllExpenseCategoriesQuery,
  useUpdateExpenseCategoryMutation,
} from "@/services/ExpenseManagement/ExpenseCategoryService";

import UpsertExpenseCategoryForm from "@/components/features/ExpenseManagement/UpsertExpenseCategoryForm";

import { ExpenseManagementActions } from "@/enumerations/ExpenseManagement/ExpenseManagementActions";
import { AppModalState } from "@/models/Common/ModalState";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import AppConstants from "@/constants/constants";
import AppDataGrid from "@/components/ui-components/AppDataGrid";

// /utilities/grid/mapExpenseCategoriesGridStateToRequest.ts

import { GridState } from "@/hooks/usePaginatedGrid";
import { GetExpenses } from "@/models/ExpenseManagement/GetExpenses";

export const mapExpenseCategoriesGridStateToRequest = (
  gridState: GridState
): GetExpenses => {
  return {
    page: gridState.page,
    pageSize: gridState.pageSize,
    searchParams: gridState.search ?? null,
  };
};

const ViewExpenseCategories = () => {
  const { t: commonLocale } = useTranslation();
  const formikRef = useRef<any>(null);

  const initialModalState: AppModalState = {
    visible: false,
    title: undefined,
    actionId: 0,
    data: undefined,
    okButtonText: undefined,
  };

  // Stripe-style DataGrid behavior
  const { gridState, setPagination, setSort, setFilter, setSearch } =
    usePaginatedGrid({ pageSize: 10 });

  const [pageActionsState, setPageActionsState] =
    useState<AppModalState>(initialModalState);

  const { data, isFetching } = useGetAllExpenseCategoriesQuery(
    mapExpenseCategoriesGridStateToRequest(gridState)
  );

  const expenseCategoryData = useMemo(() => data?.data.items ?? [], [data]);

  const [addCategory] = useAddExpenseCategoryMutation();
  const [deleteCategory] = useDeleteExpenseCategoryMutation();
  const [updateCategory] = useUpdateExpenseCategoryMutation();

  // --------------------------------------
  // Column Setup (Stripe-like minimal icons)
  // --------------------------------------
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Typography fontWeight={500}>{params.value}</Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      renderCell: (params) => (
        <Typography color="text.secondary">{params.value}</Typography>
      ),
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      width: 120,
      align: "right",
      renderCell: (params: GridRenderCellParams<any>) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteOutlineOutlinedIcon
                fontSize="small"
                sx={{ color: "darkred" }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const handleEdit = (row: any) => {
    setPageActionsState({
      actionId: ExpenseManagementActions.UPDATE_EXPENSE_CATEGORY,
      title: "Update Category",
      visible: true,
      data: row,
      okButtonText: "Update",
    });

    setTimeout(() => {
      formikRef.current?.setValues({
        id: row.id,
        name: row.name,
        description: row.description,
      });
    }, 150);
  };

  const handleDelete = (id: string) => {
    setPageActionsState({
      actionId: ExpenseManagementActions.DELETE_EXPENSE_CATEGORY,
      title: "Delete Category",
      visible: true,
      data: { id },
      okButtonText: "Delete",
    });
  };

  const handleOk = () => {
    const { actionId, data } = pageActionsState;

    if (actionId === ExpenseManagementActions.ADD_EXPENSE_CATEGORY) {
      addCategory(data)
        .unwrap()
        .then(() => toast.success("Category added"));
    }

    if (actionId === ExpenseManagementActions.UPDATE_EXPENSE_CATEGORY) {
      updateCategory(data)
        .unwrap()
        .then(() => toast.success("Category updated"));
    }

    if (actionId === ExpenseManagementActions.DELETE_EXPENSE_CATEGORY) {
      deleteCategory(data.id)
        .unwrap()
        .then(() => toast.success("Category deleted"));
    }

    setPageActionsState(initialModalState);
  };

  return (
    <AppPage
      title="Expense Categories"
      rightHeaderActions={
        <Stack direction="row" spacing={2} alignItems="center">
          <AppSearchBar
            value={gridState.search ?? ""}
            onValueChange={(v) => setSearch(v)}
            debounceMs={500}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() =>
              setPageActionsState({
                actionId: ExpenseManagementActions.ADD_EXPENSE_CATEGORY,
                visible: true,
                title: "Add Expense Category",
                okButtonText: "Add",
                data: {},
              })
            }
          >
            Add Category
          </Button>
        </Stack>
      }
      content={
        <AppPaper sx={{ padding: 3, borderRadius: 3 }}>
          {/* Stripe-like Header */}
          <Box mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Categories
            </Typography>
            <Typography color="text.secondary" fontSize="0.9rem">
              Organize and manage expense categories for transactions.
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <AppDataGrid
            records={expenseCategoryData}
            columns={columns}
            totalRecords={data?.data.totalItems ?? 0}
            isFetching={isFetching}
            paginationState={gridState}
            setPaginationState={setPagination}
            getRowId={(row) => row.id}
            hasNextPage={data?.data.isNextPage ?? false}
            overlayMessage="No categories found"
          />

          <AppModal
            modalTitle={pageActionsState.title}
            show={pageActionsState.visible}
            okButtonText={pageActionsState.okButtonText}
            handleOk={handleOk}
            handleClose={() => setPageActionsState(initialModalState)}
          >
            {pageActionsState.actionId ===
            ExpenseManagementActions.DELETE_EXPENSE_CATEGORY ? (
              <Typography>
                Are you sure you want to delete this category?
              </Typography>
            ) : (
              <UpsertExpenseCategoryForm
                formikRef={formikRef}
                onSubmit={(v) =>
                  setPageActionsState((p) => ({ ...p, data: v }))
                }
                actionId={pageActionsState.actionId}
              />
            )}
          </AppModal>
        </AppPaper>
      }
    />
  );
};

export default ViewExpenseCategories;
