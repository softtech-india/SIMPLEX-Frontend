import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import DeliveryChallanModule from "@/features/inventory/delivery-challan";



interface DeliveryChallanPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Inventory" },
  { name: "Deliver Challan" },
];

export const getStaticProps: GetStaticProps<DeliveryChallanPageProps> = async () => {
  return {
    props: {
      pageTitle: "Delivery Challan",
    },
  };
};

export default function DeliveryChallanPage({ pageTitle }: DeliveryChallanPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of delivery challan" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <DeliveryChallanModule />
      </div>
    </>
  );
}
