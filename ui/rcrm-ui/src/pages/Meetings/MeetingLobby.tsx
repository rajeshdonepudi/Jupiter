import AppIcon from "@/components/ui-components/AppIcon";
import AppLoader from "@/components/ui-components/AppLoader";
import { useTheme } from "@mui/material/styles";
import { AddOutlined, CallOutlined } from "@mui/icons-material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import NavUtilities from "@/utilities/NavUtilities";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import AppPage from "@/components/ui-components/AppPage";
import AppPaper from "@/components/ui-components/AppPaper";

enum MeetingType {
  None = 0,
  CreateMeeting,
  JoinMeeting,
}

const Meeting = () => {
  const [meetingType, setMeetingType] = useState<MeetingType>(MeetingType.None);
  const [meetingName, setMeetingName] = useState<string>("");
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <AppPage
      title="Meeting"
      rightHeaderActions={
        <Stack gap={2}>
          {meetingType === MeetingType.None && (
            <Stack flexDirection={"row"} gap={2}>
              <Button
                size="large"
                startIcon={<CallOutlined />}
                variant="contained"
                onClick={() => setMeetingType(MeetingType.CreateMeeting)}
              >
                NEW MEETING
              </Button>
              <Button
                size="large"
                startIcon={<AddOutlined />}
                variant="contained"
                onClick={() => setMeetingType(MeetingType.JoinMeeting)}
              >
                JOIN MEETING
              </Button>
            </Stack>
          )}
        </Stack>
      }
      content={
        <AppPaper>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h3">
                Start or Join Meeting!
              </Typography>
              {meetingType === MeetingType.CreateMeeting && (
                <Stack gap={2} sx={{ width: "100%", alignItems: "center" }}>
                  <Stack gap={1} direction={"row"} sx={{ width: "100%" }}>
                    <TextField
                      fullWidth
                      id="Create meeting"
                      label="Create meeting"
                      variant="outlined"
                      value={meetingName}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setMeetingName(event.target.value);
                      }}
                    />
                    <Button
                      onClick={() => {
                        navigate(
                          NavUtilities.ToSecureArea(
                            `meetings/create-join?action=${
                              MeetingType.CreateMeeting
                            }&identifier=${window.crypto.randomUUID()}&name=${meetingName}`
                          )
                        );
                      }}
                      variant="contained"
                    >
                      CREATE
                    </Button>
                  </Stack>
                  <AppIcon
                    onClick={() => setMeetingType(MeetingType.None)}
                    Icon={ArrowBackIcon}
                    color={theme.palette.primary.main}
                  />
                </Stack>
              )}
              {meetingType === MeetingType.JoinMeeting && (
                <Stack gap={2} sx={{ width: "100%", alignItems: "center" }}>
                  <Stack gap={1} direction={"row"} sx={{ width: "100%" }}>
                    <TextField
                      fullWidth
                      id="Create meeting"
                      label="Meeting URL"
                      variant="outlined"
                    />
                    <Button variant="contained">JOIN</Button>
                  </Stack>
                  <AppIcon
                    onClick={() => setMeetingType(MeetingType.None)}
                    Icon={ArrowBackIcon}
                    color={theme.palette.primary.main}
                  />
                </Stack>
              )}
            </CardContent>
          </Card>
        </AppPaper>
      }
    ></AppPage>
  );
};

export default Meeting;
