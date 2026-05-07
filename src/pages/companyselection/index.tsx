import PageHead from "@/common/components/PageHead";
import CompanySelectionModule from "@/features/utility/company-selection";
import { GetStaticProps } from "next";


interface CompanyPageProps {
  pageTitle: string;
}

export const getStaticProps: GetStaticProps<CompanyPageProps> = async () => {
  return {
    props: {
      pageTitle: "Company Selection",
    },
  };
};

export default function CompanyPage({ pageTitle }: CompanyPageProps) {
  return (
    <>
      <PageHead title={pageTitle} description="List of Companies" />
      <div>
        <CompanySelectionModule />
      </div>
    </>
  )
}