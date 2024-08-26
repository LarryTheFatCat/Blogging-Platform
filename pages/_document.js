import { Html, Head, Main, NextScript } from "next/document";

export const metadata = {
  title: "Sociallink",
  description: "Sociallink is a blogging app allowing you to express yourself and your ideas to others across the web! "
}
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
