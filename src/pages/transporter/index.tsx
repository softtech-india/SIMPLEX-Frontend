import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import TransporterModule from "@/features/master/other-master/transporter";

interface TransporterPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Master" },
  { name: "Other Master" },
  { name: "Transporter" },
];

export const getStaticProps: GetStaticProps<TransporterPageProps> = async () => {
  return {
    props: {
      pageTitle: "Transporter",
    },
  };
};

export default function TransporterPage({ pageTitle }: TransporterPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of BillTypes" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <TransporterModule />
      </div>
    </>
  );
}
