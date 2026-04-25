import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import VoucherNumberingModule from "@/features/master/other-master/vouchernumbering";


interface VoucherNumberingPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Master" },
    { name: "Invntory Master" },
    { name: "Voucher Numbering" },
];


export const getStaticProps: GetStaticProps<VoucherNumberingPageProps> = async () => {
    return {
        props: {
            pageTitle: "Voucher Numbering",
        },
    };
};

export default function UserGroupPage({ pageTitle }: VoucherNumberingPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Groups" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <VoucherNumberingModule />
            </div>
        </>
    );
}
