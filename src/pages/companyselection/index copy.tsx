import { GetStaticProps } from "next";
import { Popup } from "devextreme-react/popup";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Select, { SingleValue } from "react-select";
import { fetchCompanySelectionList } from "@/api/master/ledger-api";
import InlineSelectField from "@/common/components/InlineSelectField";
import { storageService } from "@/common/utility/storageService";
import useUserStore from "@/store/userStore";
import useCompanyStore from "@/store/useCompanyStore";
import { useRouter } from "next/router";

interface CompanyPageProps {
  pageTitle: string;
}

interface CompanyOption {
  value: number;
  label: string;
  raw: any;
}

export const getStaticProps: GetStaticProps<CompanyPageProps> = async () => {
  return {
    props: {
      pageTitle: "Company Selection",
    },
  };
};

export default function CompanyPage({ pageTitle }: CompanyPageProps) {
  const { userId } = useUserStore();
  const router = useRouter();

  const [visible, setVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyOption | null>(null);

  const onClose = () => {
    setVisible(false);
    router.push("/dashboard"); 
  };

  const { data: CompanySelection = [], isLoading } = useQuery({
    queryKey: ["CompanySelection", userId],
    queryFn: () => fetchCompanySelectionList(userId),
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false,

    select: (data) =>
      (data ?? []).map((s: any) => ({
        value: s.compid,
        label: s.compname,
        raw: s,
      })),
  });

  const handleChange = (selected: SingleValue<CompanyOption>) => {
    setSelectedCompany(selected || null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;

    setIsSubmitting(true);

    try {
      const selected = selectedCompany.raw;

      storageService.setItem("companyId", selected.compid);
      storageService.setItem("companyName", selected.compnm);

      // useCompanyStore.getState().setCompanyData({
      //   companyId: selected.compid,
      //   companyName: selected.compname,
      //   branchId: selected.branchid,
      //   branchName: selected.branchname
      // });

      useUserStore.getState().setUserData({
        companyId: selected.compid,
        branchId: selected.branchid,
        finid: selected.finid,
        branchnm: selected.branchname,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Popup
      visible={visible}
      onHiding={onClose}
      title="Company Selection"
      width="500px"
      height="auto"
      dragEnabled
      showTitle
      showCloseButton={true}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="p-4 space-y-4">
          <InlineSelectField label="Company">
            <Select
              options={CompanySelection}
              value={selectedCompany}
              onChange={handleChange}
              isLoading={isLoading}
              placeholder="Select a company..."
            />
          </InlineSelectField>
        </div>

        {/* Footer */}
        <div className="border-t p-3 flex justify-end gap-3 bg-gray-50">
          <button
            type="submit"
            disabled={isSubmitting || !selectedCompany}
            className="primary-btn disabled:opacity-50"
          >
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="secondary-btn"
          >
            Exit
          </button>
        </div>
      </form>
    </Popup>
  );
}