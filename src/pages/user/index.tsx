import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import UserModule from "@/features/admin/user";

interface UserPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Admin" },
  { name: "User" },
];

export const getStaticProps: GetStaticProps<UserPageProps> = async () => {
  return {
    props: {
      pageTitle: "User",
    },
  };
};

export default function UserPage({ pageTitle }: UserPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Users" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <UserModule />
      </div>
    </>
  );
}
