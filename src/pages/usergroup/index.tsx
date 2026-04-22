import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import UserGroupModule from "@/features/admin/user-group";

interface UserGroupPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Admin" },
  { name: "UserGroup" },
];

export const getStaticProps: GetStaticProps<UserGroupPageProps> = async () => {
  return {
    props: {
      pageTitle: "UserGroup",
    },
  };
};

export default function UserGroupPage({ pageTitle }: UserGroupPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of UserGroups" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <UserGroupModule />
      </div>
    </>
  );
}
