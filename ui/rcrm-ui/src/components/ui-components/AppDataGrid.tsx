// components/datagrid/PaginatedDataGrid.tsx
import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
  GridFilterModel,
} from "@mui/x-data-grid";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import RouterUtilities from "@/utilities/RouterUtilities";
import AppCustomNoRowsOverlay from "@ui-components/AppCustomNoRowsOverlay";
import AppConstants from "@/constants/constants";
import { alpha, useTheme } from "@mui/material";

interface PaginatedDataGridProps {
  records: any[];
  columns: GridColDef[];
  totalRecords: number;
  isFetching: boolean;
  paginationState: GridPaginationModel;
  setPaginationState: (model: GridPaginationModel) => void;
  hasNextPage: boolean;

  selectedRows?: GridRowSelectionModel;
  onRowSelectionModelChange?: (
    model: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => void;

  getRowId: (row: any) => string;

  overlayMessage?: string;
  columnsToHide?: Record<string, boolean>;

  /** ✅ Add missing prop */
  disableRowSelectionOnClick?: boolean;
}

const AppDataGrid = ({
  records,
  columns,
  totalRecords,
  isFetching,
  paginationState,
  setPaginationState,
  hasNextPage,
  selectedRows,
  onRowSelectionModelChange,
  getRowId,
  overlayMessage,
  columnsToHide,
}: PaginatedDataGridProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const theme = useTheme();

  // ---------------------------------------------
  // 1️⃣ Load PAGE + PAGE_SIZE from URL on mount
  // ---------------------------------------------
  useEffect(() => {
    const pageFromUrl = Number(searchParams.get("page")) || 0;
    const pageSizeFromUrl =
      Number(searchParams.get("pageSize")) || paginationState.pageSize;

    if (
      pageFromUrl !== paginationState.page ||
      pageSizeFromUrl !== paginationState.pageSize
    ) {
      setPaginationState({
        ...paginationState,
        page: pageFromUrl,
        pageSize: pageSizeFromUrl,
      });
    }
  }, [searchParams]);

  // ---------------------------------------------
  // 2️⃣ Handle pagination changes
  // ---------------------------------------------
  const handlePaginationChange = (model: GridPaginationModel) => {
    RouterUtilities.UpdateQueryParams(navigate, searchParams, {
      page: model.page,
      pageSize: model.pageSize,
    });

    setPaginationState(model);
  };

  // ---------------------------------------------
  // 3️⃣ Handle sort model changes
  // ---------------------------------------------
  const handleSortChange = (sortModel: GridSortModel) => {
    if (sortModel.length > 0) {
      RouterUtilities.UpdateQueryParams(navigate, searchParams, {
        sort: sortModel[0].field,
        sortDir: sortModel[0].sort!,
        page: undefined, // reset page on sorting
      });
    } else {
      RouterUtilities.UpdateQueryParams(navigate, searchParams, {
        sort: undefined,
        sortDir: undefined,
      });
    }
  };

  // ---------------------------------------------
  // 4️⃣ Handle filter model changes
  // ---------------------------------------------
  const handleFilterChange = (filterModel: GridFilterModel) => {
    const filterString = JSON.stringify(filterModel.items);

    RouterUtilities.UpdateQueryParams(navigate, searchParams, {
      filters: filterString,
      page: undefined,
    });
  };

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 2,
          border: "none",
          boxShadow: "none",

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: alpha(theme.palette.primary.main, 0.04),
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          },

          "& .MuiDataGrid-footerContainer": {
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            borderTop: `1px solid ${theme.palette.divider}`,
          },

          "& .MuiDataGrid-row": {
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
            },
          },

          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        }}
        rows={records ?? []}
        columns={columns}
        rowCount={totalRecords}
        loading={isFetching}
        getRowId={getRowId}
        checkboxSelection
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={onRowSelectionModelChange}
        disableRowSelectionOnClick
        paginationMode="server"
        sortingMode="server"
        filterMode="server"
        pageSizeOptions={AppConstants.paging.pageSizeOptions}
        paginationModel={paginationState}
        onPaginationModelChange={handlePaginationChange}
        onSortModelChange={handleSortChange}
        onFilterModelChange={handleFilterChange}
        paginationMeta={{ hasNextPage }}
        initialState={{
          columns: {
            columnVisibilityModel: columnsToHide ?? {},
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <AppCustomNoRowsOverlay overlayMessage={overlayMessage} />
          ),
        }}
      />
    </div>
  );
};

export default AppDataGrid;
