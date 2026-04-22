import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import HSNModule from "@/features/master/other-master/hsn";


interface HSNPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Master" },
    { name: "Invntory Master" },
    { name: "HSN" },
];


export const getStaticProps: GetStaticProps<HSNPageProps> = async () => {
    return {
        props: {
            pageTitle: "HSN",
        },
    };
};

export default function UserGroupPage({ pageTitle }: HSNPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Groups" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <HSNModule />
            </div>
        </>
    );
}
