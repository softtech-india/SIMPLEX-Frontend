import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import GoodReceivedNoteModule from "@/features/purchase/good-received-note";



interface GoodReceivedNoteProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Purchase" },
    { name: "Purchase Order" },
];

export const getStaticProps: GetStaticProps<GoodReceivedNoteProps> = async () => {
    return {
        props: {
            pageTitle: "Good Received Note",
        },
    };
};

export default function GoodReceivedNotePage({ pageTitle }: GoodReceivedNoteProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Good Received Note" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <GoodReceivedNoteModule />
            </div>
        </>
    );
}
