import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import ProdGroupModule from "@/features/master/inventory-master/product-group";


interface ProdGroupPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Master" },
    { name: "Invntory Master" },
    { name: "Group" },
];

export const getStaticProps: GetStaticProps<ProdGroupPageProps> = async () => {
    return {
        props: {
            pageTitle: "Product Subclass",
        },
    };
};

export default function UserGroupPage({ pageTitle }: ProdGroupPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Groups" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <ProdGroupModule />
            </div>
        </>
    );
}
