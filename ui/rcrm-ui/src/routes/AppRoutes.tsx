import { Outlet, Route, Routes } from "react-router-dom";
import AccountRoutes from "@/routes/Auth/AccountRoutes";
import DashboardRoutes from "@/routes/Dashboard/DashboardRoutes";
import Test from "../TestComponent/Test";
import { Card, CardContent } from "@mui/material";
import { ToastContainer } from "react-toastify";
import ViewAppOwner from "@/pages/Owner/ViewAppOwner";
import AppPageV2 from "@/components/ui-components/AppPage";
import Test2 from "@/TestComponent/Test2";
import GmailAuth from "../pages/Test/GmailAuth";

const AppRoutes = () => {
  return (
    <Routes>
      {AccountRoutes()}
      {DashboardRoutes()}
      <Route
        path="/t"
        element={
          <Card
            style={{ height: "95vh", overflowY: "auto" }}
            variant="outlined"
          >
            <CardContent>
              <Outlet />
              <ToastContainer
                position="top-right"
                autoClose={500000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </CardContent>
          </Card>
        }
      >
        <Route index element={<Test />}></Route>
      </Route>
      <Route path="rd" element={<ViewAppOwner />} />
      <Route path="t2" element={<Test2 />} />
      <Route path="test">
        <Route index element={<GmailAuth />}></Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
