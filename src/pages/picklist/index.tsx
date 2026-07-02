import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import PickListModule from "@/features/inventory/picklist";


interface PicklistPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Inventory" },
  { name: "Pick List" },
];

export const getStaticProps: GetStaticProps<PicklistPageProps> = async () => {
  return {
    props: {
      pageTitle: "Pick List",
    },
  };
};

export default function PicklistPage({ pageTitle }: PicklistPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Pick List" />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div>
        <PickListModule />
      </div>
    </>
  );
}
