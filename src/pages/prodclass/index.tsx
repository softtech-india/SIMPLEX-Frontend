import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import ProdClassModule from "@/features/master/inventory-master/product-class";


interface ProdClassPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Master" },
    { name: "Invntory Master" },
    { name: "Class" },
];

export const getStaticProps: GetStaticProps<ProdClassPageProps> = async () => {
    return {
        props: {
            pageTitle: "Class",
        },
    };
};

export default function UserGroupPage({ pageTitle }: ProdClassPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Classes" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <ProdClassModule />
            </div>
        </>
    );
}
