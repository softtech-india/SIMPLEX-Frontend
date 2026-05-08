import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import BillTypeModule from "@/features/master/other-master/billtype";

interface BillTypePageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Master" },
  { name: "Other Master" },
  { name: "Bill Type" },
];

export const getStaticProps: GetStaticProps<BillTypePageProps> = async () => {
  return {
    props: {
      pageTitle: "Bill Type",
    },
  };
};

export default function BillTypePage({ pageTitle }: BillTypePageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of BillTypes" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <BillTypeModule />
      </div>
    </>
  );
}
