import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import ProdCategoryModule from "@/features/master/inventory-master/product-category";


interface ProdCategoryPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Master" },
    { name: "Invntory Master" },
    { name: "Product Category" },
];

export const getStaticProps: GetStaticProps<ProdCategoryPageProps> = async () => {
    return {
        props: {
            pageTitle: "Product Category",
        },
    };
};

export default function UserGroupPage({ pageTitle }: ProdCategoryPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Product Categories" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <ProdCategoryModule />
            </div>
        </>
    );
}
