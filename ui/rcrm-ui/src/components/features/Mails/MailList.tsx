import React from "react";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { MailListItem } from "@/models/Mails/MailListItem";
import StringUtilities from "@/utilities/StringUtilities";

interface MailListProps {
  mails: MailListItem[];
  hasMore: boolean;
  loadMore: () => void;
  onMailClick: (mailId: string) => void;
  dataLength: number;
  endMessage: string;
}

const MailList: React.FC<MailListProps> = ({
  mails,
  hasMore,
  loadMore,
  onMailClick,
  dataLength,
  endMessage,
}) => {
  return (
    <InfiniteScroll
      height={"430px"}
      dataLength={mails.length}
      next={loadMore}
      hasMore={hasMore}
      loader={
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      }
      endMessage={
        <Stack alignItems={"center"}>
          <Typography variant="body2" color="primary">
            {endMessage}
          </Typography>
        </Stack>
      }
    >
      <List>
        {mails.map((mail, index) => (
          <React.Fragment key={mail.id}>
            <ListItemButton onClick={() => onMailClick(mail.id)}>
              <ListItemAvatar>
                <Avatar
                  alt="Profile Picture"
                  src={`data:image/gif;base64,${mail?.senderInfo?.avatar}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={mail.subject}
                secondary={
                  <span
                    dangerouslySetInnerHTML={{
                      __html: StringUtilities.addEllipsis(mail.body, 100),
                    }}
                  />
                }
              />
            </ListItemButton>
            {index !== mails.length - 1 && <Divider variant="inset" />}
          </React.Fragment>
        ))}
      </List>
    </InfiniteScroll>
  );
};

export default MailList;
