import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import UserPrivilegeModule from "@/features/admin/user-privilege";


interface UserPrivilegePageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Admin" },
  { name: "User Privilege" },
];

export const getStaticProps: GetStaticProps<UserPrivilegePageProps> = async () => {
  return {
    props: {
      pageTitle: "User Privilege",
    },
  };
};

export default function UserPrivilegePage({ pageTitle }: UserPrivilegePageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of User Privileges" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <UserPrivilegeModule />
      </div>
    </>
  );
}
