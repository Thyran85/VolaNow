import { RouterProvider } from "react-router";
import { router } from "./routes";
import { MobileFrame } from "./components/MobileFrame";

export default function App() {
  return (
    <div className="dark">
      <MobileFrame>
        <RouterProvider router={router} />
      </MobileFrame>
    </div>
  );
}
