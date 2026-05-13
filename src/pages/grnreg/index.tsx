import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import GRNRegisterModule from "@/features/reports/sale-purchase-report/grn-register";



interface GRNRegisterPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Reports" },
    { name: "Sale Purchase Report" },
    { name: "GRN Register" },
];

export const getStaticProps: GetStaticProps<GRNRegisterPageProps> = async () => {
    return {
        props: {
            pageTitle: "GRN Register",
        },
    };
};

export default function GRNRegisterPage({ pageTitle }: GRNRegisterPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Purchase Orders" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <GRNRegisterModule />
            </div>
        </>
    );
}
