import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import UserBranchMappingModule from "@/features/admin/user-branch-mapping";

interface UserBranchMappingPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Admin" },
  { name: "User Branch Mapping" },
];

export const getStaticProps: GetStaticProps<UserBranchMappingPageProps> = async () => {
  return {
    props: {
      pageTitle: "User Branch Mapping",
    },
  };
};

export default function UserBranchMappingPage({ pageTitle }: UserBranchMappingPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of User Branch Mappings" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <UserBranchMappingModule />
      </div>
    </>
  );
}
