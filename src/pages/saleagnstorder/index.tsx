import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import DirectSaleModule from "@/features/sale/direct-sale";


interface SalePageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Sale" },
  { name: "Order based Sale " },
];

export const getStaticProps: GetStaticProps<SalePageProps> = async () => {
  return {
    props: {
      pageTitle: "Order Based Sale ",
    },
  };
};

export default function SalePage({ pageTitle }: SalePageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Sale " />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <DirectSaleModule />
      </div>
    </>
  );
}
