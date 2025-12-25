import AppLoader from "@/components/ui-components/AppLoader";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useGetUserDetailsQuery,
  useGetUserPermissionsQuery,
  useGetUserRolesQuery,
  useRemoveUserPermissionMutation,
  useUpdateProfilePictureMutation,
} from "@/services/User/UserService";
import DisplayUtilities from "@/utilities/DisplayUtilities";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import NavUtilities from "@/utilities/NavUtilities";
import AppAccordion from "@/components/ui-components/AppAccordion";
import { toast } from "react-toastify";
import AppPage from "@/components/ui-components/AppPage";
import AppConstants from "@/constants/constants";
import AppPaper from "@/components/ui-components/AppPaper";
import Grid from "@mui/material/Grid2";
import AppCopyableText from "@/components/ui-components/AppCopyableText";
import AppModal from "@/components/ui-components/AppModal";
import AppImageCropper from "@/components/ui-components/AppImageCropper";
import { AppVisuallyHiddenInput } from "@/components/ui-components/AppVisualllyHiddenInput";
import ImageUtilities from "@/utilities/ImageUtilities";
import { ChangeEvent, useRef, useState } from "react";

const ViewUserDetails = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const resourceId = String(searchParams.get("resourceId"));
  const navigate = useNavigate();
  const { data: userDetails, isLoading: isUserDetailsLoading } =
    useGetUserDetailsQuery(String(searchParams.get("resourceId")));
  const { data: userRoles, isLoading: isUserRolesLoading } =
    useGetUserRolesQuery(resourceId);
  const { data: userPermissions, isLoading: isPermissionsLoading } =
    useGetUserPermissionsQuery(resourceId);

  const [removeUserPermission] = useRemoveUserPermissionMutation();
  const [updateProfilePicture] = useUpdateProfilePictureMutation();

  // Profile picture editing state
  const [selectedImageBase64, setSelectedImageBase64] = useState<string>("");
  const [modalState, setModalState] = useState({
    visible: false,
  });
  const imagePickerRef = useRef<any>(null);
  const photoCropperRef = useRef<any>(null);

  const onUserPermissionDelete = (permission: string) => {
    removeUserPermission({
      permission: permission,
      resourceId: resourceId,
    })
      .unwrap()
      .then(() => {
        toast("Permission removed successfully.");
      });
  };

  // Profile picture editing functions
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
          updateProfilePicture({
            userId: resourceId,
            image: String(reader?.result).split(",")[1],
          })
            .unwrap()
            .then(() => {
              toast.success("Profile picture updated successfully");
              onCancelUpdateProfilePicture();
            })
            .catch(() => {
              toast.error("Failed to update profile picture");
            });
        };
      } catch (error) {
        console.error("Error fetching image:", error);
        toast.error("Error processing image");
      }
    };
    if (croppedImage) {
      await fetchData(croppedImage);
    }
  };

  return (
    <AppPage
      title="User Details"
      rightHeaderActions={
        <Stack
          direction={"row"}
          flexWrap={"wrap"}
          justifyContent={"space-between"}
          alignItems="center"
        >
          {isUserDetailsLoading ? (
            <Skeleton height={60} width={100} />
          ) : (
            <Button
              onClick={() => navigate(NavUtilities.ToSecureArea("users"))}
              startIcon={<ArrowBackOutlinedIcon />}
            >
              Back to Users
            </Button>
          )}
        </Stack>
      }
      content={
        <>
          <AppVisuallyHiddenInput
            type="file"
            ref={imagePickerRef}
            onChange={onFileChange}
            accept="image/*"
          />
          <Grid container>
            <Grid size={12}>
              <AppPaper>
                <CardContent>
                  <Grid container spacing={AppConstants.layout.StandardSpacing}>
                    <Grid size={12}>
                      <Stack
                        direction={"column"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Box
                          sx={{ position: "relative", display: "inline-block" }}
                        >
                          {isUserDetailsLoading ? (
                            <Skeleton
                              variant="circular"
                              height={"150px"}
                              width={"150px"}
                            />
                          ) : (
                            <Avatar
                              alt={`${userDetails?.data.firstName} ${userDetails?.data.lastName}`}
                              src={`data:image/gif;base64,${userDetails?.data.avatar}`}
                              sx={{ width: 150, height: 150 }}
                            />
                          )}

                          {/* Edit Profile Picture Button */}
                          {!isUserDetailsLoading && (
                            <Box
                              sx={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                display: "flex",
                                gap: 0.5,
                              }}
                            >
                              <Tooltip title="Update profile picture">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    imagePickerRef?.current?.click()
                                  }
                                  sx={{
                                    bgcolor: "primary.main",
                                    color: "white",
                                    "&:hover": {
                                      bgcolor: "primary.dark",
                                    },
                                    width: 32,
                                    height: 32,
                                  }}
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          )}
                        </Box>

                        {isUserDetailsLoading ? (
                          <Skeleton height={"60px"} width={"100px"} />
                        ) : (
                          <Typography variant="h6">{`${userDetails?.data.fullName}`}</Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">First Name</Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {userDetails?.data.firstName}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">Last Name</Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {userDetails?.data.lastName}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">Email</Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <AppCopyableText
                            text={String(userDetails?.data.email)}
                          />
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">Full Name</Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {userDetails?.data.fullName}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">Locked</Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {DisplayUtilities.formatBoolean(
                              Boolean(userDetails?.data.isLocked)
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">
                            Lockout Enabled
                          </Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {DisplayUtilities.formatBoolean(
                              Boolean(userDetails?.data.lockoutEnabled)
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">
                            Email Confirmed
                          </Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {DisplayUtilities.formatBoolean(
                              Boolean(userDetails?.data.emailConfirmed)
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">Phone</Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {DisplayUtilities.formatPhone(
                              String(userDetails?.data.phone)
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">
                            Phone Confirmed
                          </Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {DisplayUtilities.formatBoolean(
                              Boolean(userDetails?.data.phoneNumberConfirmed)
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">
                            Two-factor Enabled
                          </Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {DisplayUtilities.formatBoolean(
                              Boolean(userDetails?.data.twoFactorEnabled)
                            )}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                    <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
                      <Stack>
                        {isUserDetailsLoading ? (
                          <Skeleton height={"20px"} width={"100px"} />
                        ) : (
                          <Typography variant="caption">
                            Lockout Probability (AI Powered)
                          </Typography>
                        )}
                        {isUserDetailsLoading ? (
                          <Skeleton height={"30px"} width={"100px"} />
                        ) : (
                          <Typography variant="body2">
                            {userDetails?.data.lockoutProbability}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </AppPaper>
            </Grid>
          </Grid>

          <Grid container>
            <Grid size={{ xl: 2, lg: 3, md: 4, sm: 12 }}>
              <Stack
                direction={"row"}
                flexWrap={"wrap"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography variant="h6" gutterBottom>
                  Roles
                </Typography>
              </Stack>
            </Grid>
            <Grid size={12}>
              {isUserRolesLoading ? (
                <Skeleton height={"250px"} />
              ) : (
                <AppPaper>
                  <CardContent>
                    <Grid
                      container
                      spacing={AppConstants.layout.StandardSpacing}
                    >
                      {userRoles?.data.length === 0 && (
                        <Stack sx={{ width: "100%" }} alignItems={"center"}>
                          <Typography variant="h6">
                            No roles associated with the user.
                          </Typography>
                        </Stack>
                      )}
                      {userRoles?.data.map((r) => (
                        <Grid>
                          {
                            <Stack>
                              <Typography variant="caption">Role</Typography>
                              <Typography variant="body2">{r}</Typography>
                            </Stack>
                          }
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </AppPaper>
              )}
            </Grid>
          </Grid>
          <Grid container>
            <Grid size={12}>
              <Stack
                direction={"row"}
                flexWrap={"wrap"}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Typography variant="h6" gutterBottom>
                  Permissions
                </Typography>
              </Stack>
            </Grid>
            <Grid size={12}>
              {isPermissionsLoading ? (
                <Skeleton height={"300px"} />
              ) : (
                <AppPaper>
                  <CardContent>
                    {userPermissions?.data.length === 0 && (
                      <Stack sx={{ width: "100%" }} alignItems={"center"}>
                        <Typography variant="h6" gutterBottom>
                          No permissions associated with the user.
                        </Typography>
                      </Stack>
                    )}
                    {userPermissions?.data.map((g) => {
                      return (
                        <Stack marginBottom={2}>
                          <AppAccordion
                            id={g.name}
                            showCustomTitle={true}
                            renderTitle={<Divider>{g.name}</Divider>}
                            content={
                              <Grid
                                container
                                spacing={AppConstants.layout.StandardSpacing}
                              >
                                {g.permissions.map((p) => {
                                  return (
                                    <Grid size={4}>
                                      <Stack
                                        gap={2}
                                        direction={"row"}
                                        alignItems={"center"}
                                      >
                                        <Chip
                                          label={p}
                                          variant="outlined"
                                          onDelete={() =>
                                            onUserPermissionDelete(p)
                                          }
                                        />
                                      </Stack>
                                    </Grid>
                                  );
                                })}
                              </Grid>
                            }
                          />
                        </Stack>
                      );
                    })}
                  </CardContent>
                </AppPaper>
              )}
            </Grid>
          </Grid>

          {/* Profile Picture Update Modal */}
          <AppModal
            modalTitle="Update Profile Picture"
            show={modalState.visible}
            okButtonText="Update"
            handleOk={onProfilePictureConfirmed}
            handleClose={onCancelUpdateProfilePicture}
            maxWidth="md"
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
    ></AppPage>
  );
};

export default ViewUserDetails;
