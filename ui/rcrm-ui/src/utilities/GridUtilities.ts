// utilities/grid/mapGridStateToApi.ts
import { GridState } from "@/hooks/usePaginatedGrid";

export interface GridApiRequest {
  page: number;
  pageSize: number;
  searchPhrase?: string;
  sort?: string;
  sortDir?: string;
  filters?: string;
  accountAlias?: string;
}

export const mapGridStateToApi = <T extends { accountAlias: string }>(
  gridState: GridState,
  extras: T
): GridApiRequest & T => {
  return {
    page: gridState.page,
    pageSize: gridState.pageSize,
    searchPhrase: gridState.search ?? "",
    sort: gridState.sort,
    sortDir: gridState.sortDir,
    filters: gridState.filters,
    ...extras, // ensures accountAlias is REQUIRED
  };
};

export default { mapGridStateToApi };
