import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import SaleRegisterModule from "@/features/reports/sale-purchase-report/salereg";



interface SaleRegisterPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Reports" },
    { name: "Inventory Report" },
];

export const getStaticProps: GetStaticProps<SaleRegisterPageProps> = async () => {
    return {
        props: {
            pageTitle: "Sale Register",
        },
    };
};

export default function PurchaseOrderPage({ pageTitle }: SaleRegisterPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Purchase Orders" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <SaleRegisterModule />
            </div>
        </>
    );
}
