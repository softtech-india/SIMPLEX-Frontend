import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import BranchModule from "@/features/admin/branch";

interface BranchPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Admin" },
  { name: "Branch" },
];

export const getStaticProps: GetStaticProps<BranchPageProps> = async () => {
  return {
    props: {
      pageTitle: "Branch",
    },
  };
};

export default function BranchPage({ pageTitle }: BranchPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Branchs" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <BranchModule />
      </div>
    </>
  );
}
