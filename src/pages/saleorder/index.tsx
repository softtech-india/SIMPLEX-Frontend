import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import SaleOrderModule from "@/features/sale/sale-order";

interface SaleOrderPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Sale" },
  { name: "Sale Order" },
];

export const getStaticProps: GetStaticProps<SaleOrderPageProps> = async () => {
  return {
    props: {
      pageTitle: "Sale Order",
    },
  };
};

export default function SaleOrderPage({ pageTitle }: SaleOrderPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Sale Order" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <SaleOrderModule />
      </div>
    </>
  );
}
