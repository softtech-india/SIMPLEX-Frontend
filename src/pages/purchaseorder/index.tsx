import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import PurchaseOrderModule from "@/features/purchase/purchase-order";



interface PurchasePageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Purchase" },
    { name: "Purchase Order" },
];

export const getStaticProps: GetStaticProps<PurchasePageProps> = async () => {
    return {
        props: {
            pageTitle: "Purchase Order",
        },
    };
};

export default function PurchaseOrderPage({ pageTitle }: PurchasePageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Purchase Orders" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <PurchaseOrderModule />
            </div>
        </>
    );
}
