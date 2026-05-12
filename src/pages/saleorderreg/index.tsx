import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import SalesOrderRegisterModule from "@/features/reports/sale-purchase-report/sales-order-register";

interface SaleOrderRegisterPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Report" },
  { name: "Sale-Purchase Report" },
  { name: "Sale Order Register" },
];

export const getStaticProps: GetStaticProps<SaleOrderRegisterPageProps> = async () => {
  return {
    props: {
      pageTitle: "Sale Order Register",
    },
  };
};

export default function SaleOrderRegisterPage({ pageTitle }: SaleOrderRegisterPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Sale Order" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <SalesOrderRegisterModule />
      </div>
    </>
  );
}
