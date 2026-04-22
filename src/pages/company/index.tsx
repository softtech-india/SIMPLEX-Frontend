import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import CompanyModule from "@/features/admin/company";

interface CompanyPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Admin" },
  { name: "Company" },
];

export const getStaticProps: GetStaticProps<CompanyPageProps> = async () => {
  return {
    props: {
      pageTitle: "Company",
    },
  };
};

export default function CompanyPage({ pageTitle }: CompanyPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Companys" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <CompanyModule />
      </div>
    </>
  );
}
