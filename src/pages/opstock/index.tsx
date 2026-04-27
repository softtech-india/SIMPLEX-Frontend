import { GetStaticProps } from "next";
import PageHead from "@/common/components/PageHead";
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";
import OpeningStockModule from "@/features/master/inventory-master/opening-stock";


interface OpeningStockPageProps {
    pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { name: "Master" },
    { name: "Invntory Master" },
    { name: "Opening Stock" },
];

export const getStaticProps: GetStaticProps<OpeningStockPageProps> = async () => {
    return {
        props: {
            pageTitle: "Opening Stock ",
        },
    };
};

export default function OpeningStockPage({ pageTitle }: OpeningStockPageProps) {
    return (
        <>
            <PageHead title={pageTitle} description="List of OpeninStock " />
            <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
            <div>
                <OpeningStockModule />
            </div>
        </>
    );
}
