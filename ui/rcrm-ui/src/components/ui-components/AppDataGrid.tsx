import {
  DataGrid,
  GridAutosizeOptions,
  GridCallbackDetails,
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
  GridRowsProp,
} from "@mui/x-data-grid";
import AppConstants from "../../constants/constants";
import AppCustomNoRowsOverlay from "@ui-components/AppCustomNoRowsOverlay";

const AppDataGrid = (props: {
  records: GridRowsProp<any>;
  columns: GridColDef[];
  totalRecords: number;
  isFetching: boolean;
  paginationState: GridPaginationModel;
  columnsToHide: {};
  setPaginationState: (
    model: GridPaginationModel,
    details: GridCallbackDetails<any>
  ) => void;
  setRowId: (row: any) => string;
  disableRowSelectionOnClick?: boolean;
  onRowSelectionModelChange?: (
    model: GridRowSelectionModel,
    details: GridCallbackDetails<any>
  ) => void;
  selectedRows?: any;
  hasNextPage: boolean;
  overlayMessage?: string;
}) => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        initialState={{
          columns: {
            columnVisibilityModel: props?.columnsToHide,
          },
        }}
        slots={{
          noRowsOverlay: () => (
            <AppCustomNoRowsOverlay overlayMessage={props?.overlayMessage} />
          ),
        }}
        // sx={{ "--DataGrid-overlayHeight": "300px" }}
        rows={props?.records ?? []}
        columns={props?.columns ?? []}
        rowCount={props?.totalRecords ?? 0}
        paginationMeta={{
          hasNextPage: props?.hasNextPage,
        }}
        loading={props?.isFetching ?? false}
        paginationModel={props?.paginationState}
        paginationMode="server"
        onPaginationModelChange={props?.setPaginationState}
        pageSizeOptions={AppConstants.paging.pageSizeOptions}
        checkboxSelection
        getRowId={props?.setRowId}
        onRowSelectionModelChange={props?.onRowSelectionModelChange}
        rowSelectionModel={props?.selectedRows}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default AppDataGrid;
