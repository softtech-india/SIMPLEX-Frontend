import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import VendorModule from "@/features/master/account-master/vendor";



interface UserPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Master" },
  { name: "Account Master" },
  { name: "Vendor", path: "/vendor" },
];

export const getStaticProps: GetStaticProps<UserPageProps> = async () => {
  return {
    props: {
      pageTitle: "Vendor",
    },
  };
};

export default function UserPage({ pageTitle }: UserPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Vendor" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <VendorModule />
      </div>
    </>
  );
}
