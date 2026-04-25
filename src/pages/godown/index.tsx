import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import GodownModule from "@/features/master/other-master/godown";


interface GodownPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Master" },
    { name: "Invntory Master" },
    { name: "Godown" },
];


export const getStaticProps: GetStaticProps<GodownPageProps> = async () => {
    return {
        props: {
            pageTitle: "Godown",
        },
    };
};

export default function UserGroupPage({ pageTitle }: GodownPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Groups" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <GodownModule />
            </div>
        </>
    );
}
