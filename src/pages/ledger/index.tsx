import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import LedgerModule from "@/features/master/account-master/ledger";



interface UserPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Master" },
  { name: "Account Master" },
  { name: "Ledger ", path: "/ledger" },
];

export const getStaticProps: GetStaticProps<UserPageProps> = async () => {
  return {
    props: {
      pageTitle: "Ledger ",
    },
  };
};

export default function UserPage({ pageTitle }: UserPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Ledger s" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <LedgerModule />
      </div>
    </>
  );
}
