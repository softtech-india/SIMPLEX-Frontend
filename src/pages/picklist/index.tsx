import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import PickListModule from "@/features/inventory/picklist";


interface PicklistPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Inventory" },
  { name: "Pick list" },
];

export const getStaticProps: GetStaticProps<PicklistPageProps> = async () => {
  return {
    props: {
      pageTitle: "Pick list",
    },
  };
};

export default function PicklistPage({ pageTitle }: PicklistPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Pick list" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <PickListModule />
      </div>
    </>
  );
}
