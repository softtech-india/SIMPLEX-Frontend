import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import FinyearModule from "@/features/admin/financial-year";

interface FinyearPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Admin" },
  { name: "Financial Year" },
];

export const getStaticProps: GetStaticProps<FinyearPageProps> = async () => {
  return {
    props: {
      pageTitle: "Financial Year",
    },
  };
};

export default function FinyearPage({ pageTitle }: FinyearPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Finyears" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <FinyearModule />
      </div>
    </>
  );
}
