import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import PurchaseOrderRegisterModule from "@/features/reports/sale-purchase-report/purchase-order-register";

interface PurchaseOrderRegisterPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Reports" },
    { name: "Sale Purchase Report" },
    { name: "Purchase Order Register" },
];

export const getStaticProps: GetStaticProps<PurchaseOrderRegisterPageProps> = async () => {
    return {
        props: {
            pageTitle: "Purchase Order Register",
        },
    };
};

export default function PurchaseOrderPage({ pageTitle }: PurchaseOrderRegisterPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Purchase Orders" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <PurchaseOrderRegisterModule />
            </div>
        </>
    );
}
