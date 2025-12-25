// hooks/usePaginatedGrid.ts
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RouterUtilities from "@/utilities/RouterUtilities";
import {
  GridPaginationModel,
  GridSortModel,
  GridFilterModel,
} from "@mui/x-data-grid";

export interface GridState {
  page: number;
  pageSize: number;
  sort?: string;
  sortDir?: string;
  filters?: string;
  search?: string;
}

export const usePaginatedGrid = (defaults?: Partial<GridState>) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ----------------------------------------------------
  // 1️⃣ Build initial state from URL → with fallbacks
  // ----------------------------------------------------
  const initialState: GridState = {
    page: Number(searchParams.get("page")) || defaults?.page || 0,
    pageSize: Number(searchParams.get("pageSize")) || defaults?.pageSize || 10,
    sort: searchParams.get("sort") || defaults?.sort,
    sortDir: searchParams.get("sortDir") || defaults?.sortDir,
    filters: searchParams.get("filters") || defaults?.filters,
    search: searchParams.get("search") || defaults?.search,
  };

  const [state, setState] = useState<GridState>(initialState);

  // ----------------------------------------------------
  // 2️⃣ Sync state when URL changes externally
  // ----------------------------------------------------
  useEffect(() => {
    const urlState: GridState = {
      page: Number(searchParams.get("page")) || 0,
      pageSize: Number(searchParams.get("pageSize")) || state.pageSize,
      sort: searchParams.get("sort") || undefined,
      sortDir: searchParams.get("sortDir") || undefined,
      filters: searchParams.get("filters") || undefined,
      search: searchParams.get("search") || undefined,
    };

    setState(urlState);
  }, [searchParams]);

  // ----------------------------------------------------
  // 3️⃣ Update URL and internal state together
  // ----------------------------------------------------
  const updateQuery = (newParams: Partial<GridState>) => {
    RouterUtilities.UpdateQueryParams(navigate, searchParams, newParams);
  };

  // ----------------------------------------------------
  // 4️⃣ Handlers for DataGrid
  // ----------------------------------------------------
  const setPagination = (model: GridPaginationModel) => {
    setState((prev) => ({ ...prev, ...model }));
    updateQuery({
      page: model.page,
      pageSize: model.pageSize,
    });
  };

  const setSort = (sortModel: GridSortModel) => {
    if (sortModel.length > 0) {
      const sort = sortModel[0].field;
      const sortDir = sortModel[0].sort!;
      setState((prev) => ({ ...prev, sort, sortDir, page: 0 }));
      updateQuery({ sort, sortDir, page: 0 });
    } else {
      setState((prev) => ({ ...prev, sort: undefined, sortDir: undefined }));
      updateQuery({ sort: undefined, sortDir: undefined });
    }
  };

  const setFilter = (filterModel: GridFilterModel) => {
    const compressed = JSON.stringify(filterModel.items);
    setState((prev) => ({ ...prev, filters: compressed, page: 0 }));
    updateQuery({ filters: compressed, page: 0 });
  };

  const setSearch = (value: string) => {
    setState((prev) => ({ ...prev, search: value, page: 0 }));
    updateQuery({ search: value, page: 0 });
  };

  return {
    gridState: state,
    setPagination,
    setSort,
    setFilter,
    setSearch,
  };
};
