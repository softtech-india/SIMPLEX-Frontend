import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import ProdUnitModule from "@/features/master/inventory-master/product-unit";


interface ProdUnitPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Master" },
    { name: "Invntory Master" },
    { name: "Unit" },
];



export const getStaticProps: GetStaticProps<ProdUnitPageProps> = async () => {
    return {
        props: {
            pageTitle: "Product Unit",
        },
    };
};

export default function UserGroupPage({ pageTitle }: ProdUnitPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of Groups" />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <ProdUnitModule />
            </div>
        </>
    );
}
