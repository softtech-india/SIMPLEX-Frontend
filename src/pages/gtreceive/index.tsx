import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import GodownTransferReceiveModule from "@/features/inventory/godown-transfer-receive";

interface GodownTransferReceiveProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Inventory" },
    { name: "Godown Transfer Receive" },
];

export const getStaticProps: GetStaticProps<GodownTransferReceiveProps> = async () => {
    return {
        props: {
            pageTitle: "Godown Transfer Receive",
        },
    };
};

export default function GodownTransferReceivePage({ pageTitle }: GodownTransferReceiveProps) {
    return (
        <>
            <PageHead title={pageTitle} description="Godown Transfer Receive list and details" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <GodownTransferReceiveModule />
            </div>
        </>
    );
}
