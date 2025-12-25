// src/app/hooks.ts
import { AppDispatch, RootState } from "@/store/Store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// hooks/useTabs.ts
import { useSearchParams, useNavigate } from "react-router-dom";
import RouterUtilities from "@/utilities/RouterUtilities";

export const useTabs = (tabMap: string[]) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const activeIndex =
    tabParam && tabMap.includes(tabParam) ? tabMap.indexOf(tabParam) : 0;

  const setTab = (index: number) => {
    RouterUtilities.UpdateQueryParams(navigate, searchParams, {
      tab: tabMap[index],
      page: undefined, // always clear pagination when switching tabs
    });
  };

  return { activeIndex, setTab };
};
