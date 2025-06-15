import AppButton from "@/components/ui-components/AppButton";
import AppPage from "@/components/ui-components/AppPage";
import { Button, Skeleton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid2";
import AppDataGrid from "@/components/ui-components/AppDataGrid";
import { GridPaginationModel, GridCallbackDetails } from "@mui/x-data-grid";
import { useState } from "react";

const ManageLeads = () => {
  const { t: commonLocale } = useTranslation("common");

  const [paginationModel, setPaginationModel] = useState<{
    accountAlias?: "";
    searchPhrase?: "";
    page: number;
    pageSize: number;
  }>({
    page: 0,
    pageSize: 5,
    accountAlias: "",
    searchPhrase: "",
  });

  return (
    <AppPage
      title="Manage Leads"
      rightHeaderActions={
        <>
          {false ? (
            <Skeleton height={60} width={100} />
          ) : (
            <Button
              onClick={() => {}}
              variant="contained"
              startIcon={<AddIcon />}
            >
              {`${commonLocale("add")} ${commonLocale("lead")}`}
            </Button>
          )}
        </>
      }
      content={
        <Grid container>
          <Grid size={{ sm: 12 }}>
            <AppDataGrid
              records={[]}
              columns={[]}
              totalRecords={0}
              isFetching={false}
              setPaginationState={function (
                model: GridPaginationModel,
                details: GridCallbackDetails<any>
              ): void {
                throw new Error("Function not implemented.");
              }}
              setRowId={function (row: any): string {
                throw new Error("Function not implemented.");
              }}
              hasNextPage={false}
              paginationState={paginationModel}
              columnsToHide={{
                id: false,
              }}
            />
          </Grid>
        </Grid>
      }
    />
  );
};

export default ManageLeads;
