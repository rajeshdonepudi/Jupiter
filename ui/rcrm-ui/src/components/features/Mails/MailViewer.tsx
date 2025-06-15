import React, { useEffect, useState } from "react";
import { IconButton, Stack, Box } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { FilterMail } from "@/models/Mails/FilterMails";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MailList from "./MailList";
import { MailListItem } from "@/models/Mails/MailListItem";
import NavUtilities from "@/utilities/NavUtilities";

interface MailViewerProps {
  fetchMails: (filter: FilterMail) => any; // You can replace "any" with the actual return type of your query
  initialEndMessage: string;
  initialPageSize?: number;
  fromView: string;
}

const MailViewer: React.FC<MailViewerProps> = ({
  fetchMails,
  initialEndMessage,
  initialPageSize = 10,
  fromView,
}) => {
  const loggedInUser = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const [filterState, setFilterState] = useState<FilterMail>({
    page: 0,
    pageSize: initialPageSize,
    userId: loggedInUser.id,
    searchTerm: null,
  });
  const [mailViewerState, setMailViewerState] = useState({
    dataLength: 0,
    hasMore: false,
    data: [] as MailListItem[],
  });

  const { refetch, isFetching } = fetchMails(filterState);

  const onNext = () => {
    setFilterState((prev) => ({
      ...prev,
      page: prev.page + 1,
    }));
  };

  useEffect(() => {
    refetch()
      .unwrap()
      .then((res: any) => {
        if (res?.data) {
          setMailViewerState((prev) => {
            const idSet = new Set(prev.data.map((item) => item.id));
            res.data.items.forEach((item: any) => {
              idSet.add(item.id);
            });

            const mergedData = Array.from(idSet).map((id) => {
              const existingItem =
                prev.data.find((item) => item.id === id) ||
                res.data.items.find((item: { id: string }) => item.id === id);
              return existingItem;
            });

            return {
              ...prev,
              dataLength: res.data.totalItems,
              hasMore: res.data.isNextPage,
              data: mergedData,
            };
          });
        }
      });
  }, [filterState.page, refetch]);

  const handleMailClick = (mailId: string) => {
    navigate(
      NavUtilities.ToSecureArea(`mails/view/${mailId}?from=${fromView}`)
    );
  };

  return (
    <Stack>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ height: "40px", padding: "0.2rem" }}
      >
        <Stack>
          {!isFetching && (
            <IconButton onClick={() => refetch()} color="secondary">
              <RefreshIcon />
            </IconButton>
          )}
        </Stack>
        <Box>
          Showing {(filterState.page - 1) * filterState.pageSize + 1} -{" "}
          {Math.min(
            filterState.page * filterState.pageSize,
            mailViewerState.dataLength
          )}{" "}
          of {mailViewerState.dataLength}
        </Box>
      </Stack>
      <MailList
        mails={mailViewerState.data}
        hasMore={mailViewerState.hasMore}
        loadMore={onNext}
        onMailClick={handleMailClick}
        dataLength={mailViewerState.dataLength}
        endMessage={initialEndMessage}
      />
    </Stack>
  );
};

export default MailViewer;
