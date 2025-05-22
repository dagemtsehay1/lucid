import "./globals.css";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import Provider from "@/store/provider";

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <Provider>
          <MantineProvider>{children}</MantineProvider>
        </Provider>
      </body>
    </html>
  );
}
