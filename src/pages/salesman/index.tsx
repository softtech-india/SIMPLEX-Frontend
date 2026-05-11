import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import SalesManModule from "@/features/master/other-master/salesman";

interface SalesManPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Master" },
  { name: "Other Master" },
  { name: "Salesman" },
];

export const getStaticProps: GetStaticProps<SalesManPageProps> = async () => {
  return {
    props: {
      pageTitle: "Salesman",
    },
  };
};

export default function SalesManPage({ pageTitle }: SalesManPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of BillTypes" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <SalesManModule />
      </div>
    </>
  );
}
