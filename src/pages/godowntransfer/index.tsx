import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import GodownTransferModule from "@/features/inventory/godown-transfer";



interface GoodReceivedNoteProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Inventory" },
    { name: "Godown Transfer" },
];

export const getStaticProps: GetStaticProps<GoodReceivedNoteProps> = async () => {
    return {
        props: {
            pageTitle: "Godown Transfer",
        },
    };
};

export default function GoodReceivedNotePage({ pageTitle }: GoodReceivedNoteProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Good Received Note" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <GodownTransferModule />
            </div>
        </>
    );
}
