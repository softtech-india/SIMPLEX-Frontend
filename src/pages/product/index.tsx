import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import ProductModule from "@/features/master/inventory-master/product";


interface ProductPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Master" },
    { name: "Invntory Master" },
    { name: "Product" },
];



export const getStaticProps: GetStaticProps<ProductPageProps> = async () => {
    return {
        props: {
            pageTitle: "Product",
        },
    };
};

export default function UserGroupPage({ pageTitle }: ProductPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Groups" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <ProductModule />
            </div>
        </>
    );
}
