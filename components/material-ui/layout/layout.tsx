import { ThemeProvider } from "@mui/material";
import React from "react";

import MaterialUiTheme from "../material-ui-theme";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={MaterialUiTheme}>
      <main className="z-10">{children}</main>
    </ThemeProvider>
  );
}
