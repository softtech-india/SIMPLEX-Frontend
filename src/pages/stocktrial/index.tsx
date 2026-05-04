import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import StockTrialModule from "@/features/reports/inventory-stock/stock-trial";



interface StockTrialPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Reports" },
    { name: "Inventory Report" },
];

export const getStaticProps: GetStaticProps<StockTrialPageProps> = async () => {
    return {
        props: {
            pageTitle: "Stock Trial",
        },
    };
};

export default function PurchaseOrderPage({ pageTitle }: StockTrialPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Purchase Orders" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <StockTrialModule />
            </div>
        </>
    );
}
