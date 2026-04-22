import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import LedgerGroup from "@/features/master/account-master/ledger-group";


interface UserPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Master" },
  { name: "Account Master" },
  { name: "Ledger Group", path: "/ledgergroup" },
];

export const getStaticProps: GetStaticProps<UserPageProps> = async () => {
  return {
    props: {
      pageTitle: "Ledger Group",
    },
  };
};

export default function UserPage({ pageTitle }: UserPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Ledger Groups" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        
        <LedgerGroup/>
      </div>
    </>
  );
}
