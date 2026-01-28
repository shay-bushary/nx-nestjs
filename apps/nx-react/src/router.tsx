import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { SinglePlayerGame } from "./pages/SinglePlayerGame";
import { TwoPlayerSetup } from "./pages/TwoPlayerSetup";
import { TwoPlayerGame } from "./pages/TwoPlayerGame";
import { lazy } from "react";

const MainMenu = lazy(() =>
  import("./pages/MainMenu").then((module) => ({ default: module.MainMenu }))
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: MainMenu }, // Root redirects to hangman menu
      {
        path: "hangman",
        children: [
          { index: true, Component: MainMenu },
          { path: "single", Component: SinglePlayerGame },
          {
            path: "two-player",
            children: [
              { path: "setup", Component: TwoPlayerSetup },
              { path: "game", Component: TwoPlayerGame },
            ],
          },
        ],
      },
    ],
  },
]);
