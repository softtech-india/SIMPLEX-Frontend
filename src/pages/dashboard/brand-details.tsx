import { GetStaticProps } from 'next';
import BrandDetails from '@/common/components/dashboard/components/tab-section/card-details/BrandDetails';
import PageHead from '@/common/components/PageHead';
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";

interface BrandDetailsPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Dashboard", path: "/dashboard" },
  { name: `Purchase Details`, path: `/dashboard/details?type=purchase` },
  { name: "Brand Details" },
];


export const getStaticProps: GetStaticProps<BrandDetailsPageProps> = async () => {
  return {
    props: {
      pageTitle: "Brand Details",
    },
  };
};

export default function BrandDetailsPage({ pageTitle }: BrandDetailsPageProps) {

  return (
    <>
      <PageHead title={pageTitle} />
      <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
      <div className="mx-0 my-0 sm:mx-4 sm:my-6 md:mx-0 md:my-0">
        <BrandDetails />
      </div>
    </>
  );
}