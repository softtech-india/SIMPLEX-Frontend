import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import CustomerModule from "@/features/master/account-master/customer";



interface UserPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Master" },
  { name: "Account Master" },
  { name: "Customer", path: "/customer" },
];

export const getStaticProps: GetStaticProps<UserPageProps> = async () => {
  return {
    props: {
      pageTitle: "Customer",
    },
  };
};

export default function UserPage({ pageTitle }: UserPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Customer" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <CustomerModule />
      </div>
    </>
  );
}
