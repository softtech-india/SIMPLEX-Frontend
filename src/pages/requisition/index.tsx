import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import RequisitionModule from "@/features/inventory/requisition";



interface RequisitionPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Inventory" },
    { name: "Requisition" },
];

export const getStaticProps: GetStaticProps<RequisitionPageProps> = async () => {
    return {
        props: {
            pageTitle: "Requisition",
        },
    };
};

export default function PurchaseOrderPage({ pageTitle }: RequisitionPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Requisition" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <RequisitionModule />
            </div>
        </>
    );
}
