import Head from "next/head";

interface PageHeadProps {
  title: string;
  description?: string;
}

const APP_NAME = "SIMPLEX"; 

export default function PageHead({ title, description }: PageHeadProps) {
  return (
    <Head>
      <title>{`${title} | ${APP_NAME}`}</title>
      <meta name="description" content={description ?? `${title} | ${APP_NAME}`} />
    </Head>
  );
}