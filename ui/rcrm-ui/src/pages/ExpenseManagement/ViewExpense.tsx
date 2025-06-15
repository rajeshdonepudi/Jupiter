import AppPage from "@/components/ui-components/AppPage";
import CurrencyUtilities from "@/utilities/CurrencyUtilities";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate, useSearchParams } from "react-router-dom";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import NavUtilities from "@/utilities/NavUtilities";
import { useLazyGetExpenseDetailsQuery } from "@/services/ExpenseManagement/ExpenseService";
import { useEffect, useMemo } from "react";
import AppConstants from "@/constants/constants";
import DateTimeUtilities from "@/utilities/DateTimeUtilities";
import AppPaper from "@/components/ui-components/AppPaper";

const ViewExpense = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const [getExpenseData, { data: expenseData, isFetching }] =
    useLazyGetExpenseDetailsQuery();

  const expenseId = searchParams.get("expenseId");

  const expenseDetails = useMemo(() => {
    return expenseData?.data;
  }, [expenseData]);

  useEffect(() => {
    if (expenseId) {
      getExpenseData(expenseId);
    }
  }, [expenseId]);

  return (
    <AppPage
      title="View Expense"
      rightHeaderActions={
        <Button
          onClick={() => navigate(NavUtilities.ToSecureArea("expenses/my"))}
          startIcon={<ArrowBackOutlinedIcon />}
        >
          Back to Expenses
        </Button>
      }
      content={
        <AppPaper>
          <CardContent>
            <Grid container>
              <Grid size={{ md: 12 }}>
                <Stack alignItems={"center"}>
                  <Typography variant="caption">Amount</Typography>
                  {isFetching ? (
                    <Skeleton variant="text" width={100} height={150} />
                  ) : (
                    <Typography variant="h2">
                      {CurrencyUtilities.formatIndianCurrency(
                        expenseDetails?.amount ?? 0
                      )}
                    </Typography>
                  )}
                </Stack>
              </Grid>
              <Grid size={{ md: 12 }}>
                <Stack alignItems={"center"}>
                  <Typography variant="caption">Description</Typography>
                  {isFetching ? (
                    <Skeleton
                      variant="rectangular"
                      width={400}
                      height={50}
                      sx={{ maxWidth: "100%" }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ maxWidth: "400px", overflowX: "auto" }}
                    >
                      {expenseDetails?.description}
                    </Typography>
                  )}
                </Stack>
              </Grid>
              <Grid size={{ md: 12 }}>
                <Divider sx={{ margin: AppConstants.layout.StandardSpacing }} />
              </Grid>
              <Grid size={{ md: 12 }}>
                <Grid container spacing={AppConstants.layout.StandardSpacing}>
                  <Grid size={{ md: 4 }}>
                    {isFetching ? (
                      <Stack spacing={AppConstants.layout.StandardSpacing}>
                        <Skeleton variant="text" width={40} height={20} />
                        <Skeleton variant="text" width={100} height={24} />
                      </Stack>
                    ) : (
                      <Stack>
                        <Typography variant="caption">Category</Typography>
                        <Typography variant="body2">
                          {expenseDetails?.categoryName}
                        </Typography>
                      </Stack>
                    )}
                  </Grid>
                  <Grid size={{ md: 4 }}>
                    {isFetching ? (
                      <Stack spacing={AppConstants.layout.StandardSpacing}>
                        <Skeleton variant="text" width={40} height={20} />
                        <Skeleton variant="text" width={100} height={24} />
                      </Stack>
                    ) : (
                      <Stack>
                        <Typography variant="caption">Expense Type</Typography>
                        <Typography variant="body2">
                          {expenseDetails?.expenseType}
                        </Typography>
                      </Stack>
                    )}
                  </Grid>
                  <Grid size={{ md: 4 }}>
                    {isFetching ? (
                      <Stack spacing={AppConstants.layout.StandardSpacing}>
                        <Skeleton variant="text" width={40} height={20} />
                        <Skeleton variant="text" width={100} height={24} />
                      </Stack>
                    ) : (
                      <Stack>
                        <Typography variant="caption">Added On</Typography>
                        <Typography variant="body2">
                          {DateTimeUtilities.toRelativeTime(
                            expenseDetails?.addedOn
                          )}
                        </Typography>
                      </Stack>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </AppPaper>
      }
    ></AppPage>
  );
};

export default ViewExpense;
