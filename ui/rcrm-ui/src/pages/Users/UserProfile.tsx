import { ChangeEvent, lazy, useMemo, useRef, useState } from "react";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const Stack = lazy(() => import("@mui/material/Stack"));

import Paper from "@mui/material/Paper";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  IconButton,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import AppLoader from "@/components/ui-components/AppLoader";
import Grid from "@mui/material/Grid2";
import AppModal from "@/components/ui-components/AppModal";
import AppImageCropper from "@/components/ui-components/AppImageCropper";
import {
  useGetUserProfileInfoQuery,
  useUpdateProfilePictureMutation,
} from "@/services/User/UserService";
import { AppVisuallyHiddenInput } from "@/components/ui-components/AppVisualllyHiddenInput";
import ImageUtilities from "@/utilities/ImageUtilities";
import AppPage from "@/components/ui-components/AppPage";
import AppConstants from "@/constants/constants";
import AppPaper from "@/components/ui-components/AppPaper";
import AppCopyableText from "@/components/ui-components/AppCopyableText";
import { updateProfilePicture } from "@/store/Slices/authSlice";
import { InfoGrid } from "@/components/ui-components/AppInfoGrid";

const UserProfile = () => {
  const [uploadProfilePicture] = useUpdateProfilePictureMutation();
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>("");
  const [modalState, setModalState] = useState({
    visible: false,
  });
  const imagePickerRef = useRef<any>(null);
  const loggedInUser = useSelector((state: any) => state.auth);
  const { data: userInfo, isLoading: isUserInfoLoading } =
    useGetUserProfileInfoQuery(loggedInUser.id);
  const dispatch = useDispatch();

  const userDetails = useMemo(() => {
    return userInfo?.data;
  }, [userInfo?.data]);

  const photoCropperRef = useRef<any>(null);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = async () => {
        const byteArray = new Uint8Array(reader.result as ArrayBuffer);
        setSelectedImageBase64(
          `data:image/png;base64, ${ImageUtilities.convertArrayBufferToBase64(
            byteArray
          )}`
        );
        setModalState(() => {
          return {
            visible: true,
          };
        });
      };
    }
  };

  const onCancelUpdateProfilePicture = () => {
    setModalState(() => {
      return {
        visible: false,
      };
    });
    setSelectedImageBase64("");
  };

  const onProfilePictureConfirmed = async () => {
    const croppedImage = await photoCropperRef?.current?.getCroppedImage();
    const fetchData = async (imageUrl: string) => {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          uploadProfilePicture({
            userId: loggedInUser.id,
            image: String(reader?.result).split(",")[1],
          })
            .unwrap()
            .then(() => {
              dispatch(
                updateProfilePicture({
                  profilePicture: String(reader?.result).split(",")[1],
                })
              );
              onCancelUpdateProfilePicture();
            });
        };
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    if (croppedImage) {
      await fetchData(croppedImage);
    }
  };

  return (
    <AppPage
      title="Profile"
      content={
        <>
          <AppVisuallyHiddenInput
            type="file"
            ref={imagePickerRef}
            onChange={onFileChange}
          />
          <Grid container spacing={0.8}>
            <Grid size={{ xs: 12, md: 12 }}>
              <AppPaper>
                <Stack
                  direction={"row"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Stack
                    direction={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    {isUserInfoLoading ? (
                      <Skeleton variant="circular" width={150} height={150} />
                    ) : (
                      <Avatar
                        alt={`${userInfo?.data.firstName} ${userInfo?.data.lastName}`}
                        src={`data:image/gif;base64,${userInfo?.data.avatar}`}
                        sx={{ width: 150, height: 150 }}
                      />
                    )}
                    {isUserInfoLoading ? (
                      <Skeleton variant="rectangular" width={210} height={60} />
                    ) : (
                      <Typography variant="h6">{`${userDetails?.fullName}`}</Typography>
                    )}

                    <Stack direction={"row"}>
                      <Tooltip title="Update profile picture">
                        <IconButton
                          onClick={() => imagePickerRef?.current?.click()}
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Remove profile picture">
                        <IconButton>
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Stack>
              </AppPaper>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <AppPaper>
                <InfoGrid
                  loading={isUserInfoLoading}
                  items={[
                    { label: "First Name", value: userDetails?.firstName },
                    { label: "Last Name", value: userDetails?.lastName },
                    { label: "Email", value: userDetails?.email },
                    { label: "Phone", value: userDetails?.phone },
                  ]}
                />
              </AppPaper>
            </Grid>
          </Grid>
          <AppModal
            modalTitle={"Update profile picture"}
            show={modalState.visible}
            okButtonText={"Update"}
            handleOk={onProfilePictureConfirmed}
            handleClose={onCancelUpdateProfilePicture}
          >
            <Stack>
              <AppImageCropper
                ref={photoCropperRef}
                image={selectedImageBase64}
              />
            </Stack>
          </AppModal>
        </>
      }
    />
  );
};

export default UserProfile;
