import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import WithdrawalPage from "./pages/WithdrawalPage";
import TransferPage from "./pages/TransferPage";
import RechargePage from "./pages/RechargePage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/withdrawal",
    Component: WithdrawalPage,
  },
  {
    path: "/transfer",
    Component: TransferPage,
  },
  {
    path: "/recharge",
    Component: RechargePage,
  },
]);
