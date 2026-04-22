import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import CompanyFinyearMappingModule from "@/features/admin/company-finyear-mapping";

interface CompanyFinyearMappingPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Admin" },
  { name: "Financial Year" },
];

export const getStaticProps: GetStaticProps<CompanyFinyearMappingPageProps> = async () => {
  return {
    props: {
      pageTitle: "Financial Year",
    },
  };
};

export default function CompanyFinyearMappingPage({ pageTitle }: CompanyFinyearMappingPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of CompanyFinyearMappings" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <CompanyFinyearMappingModule />
      </div>
    </>
  );
}
