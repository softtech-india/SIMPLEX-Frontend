import { GetStaticProps } from 'next';
import Dashboard from '../../common/components/dashboard/index';
import PageHead from '@/common/components/PageHead';
import BreadcrumbHeader, { BreadcrumbItem } from "@/common/components/Breadcrumb";

interface DashboardPageProps {
  pageTitle: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { name: "dashboard", path: "/dashboard" },
];

export const getStaticProps: GetStaticProps<DashboardPageProps> = async () => {
  return {
    props: {
      pageTitle: "Dashboard",
    },
  };
};

export default function DashboardPage({ pageTitle }: DashboardPageProps) {
  return (
    <>
      <PageHead title={pageTitle} />
       <BreadcrumbHeader title={pageTitle} breadcrumbs={breadcrumbs} />
       <div className="mx-0 my-0 sm:mx-4 sm:my-6 md:mx-0 md:my-0">
        <Dashboard />
      </div>
    </>
  );
}
