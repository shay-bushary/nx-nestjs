import { Outlet } from "react-router";
import { TwoPlayerProvider } from "../context/TwoPlayerContext";

export function RootLayout() {
  return (
    <TwoPlayerProvider>
      <div className="app-container">
        <Outlet />
      </div>
    </TwoPlayerProvider>
  );
}
