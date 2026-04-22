'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DataGrid, Column } from 'devextreme-react/data-grid';

import {
  useCompanies,
  useCompFinyearMapping,
  useCreateCompFinyearMapping
} from './hooks/useCompFinyearMapping';

type FormData = {
  companyId: number | null;
  finid: number | null;
};

export default function CompanyFinyearMappingModule() {
  const [selectedFinyear, setSelectedFinyear] = useState<number | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      companyId: null,
      finid: null
    }
  });

  const { data: companies = [] } = useCompanies();
  const { data: mappingData } = useCompFinyearMapping(selectedCompany);

  const createMapping = useCreateCompFinyearMapping();

  const mappedList = mappingData?.mapped || [];
  const unmappedList = mappingData?.unMapped || [];

  const handleCompanyChange = (companyId: number) => {
    setSelectedCompany(companyId);
  };

  const onSubmit = async () => {
    if (!selectedCompany || !selectedFinyear) return;

    await createMapping.mutateAsync({
      companyId: Number(selectedCompany),
      finid: selectedFinyear,
    });

    setSelectedFinyear(null);
  };

  return (
    <div className="Finyear-module">

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">

        <div className="flex-1 overflow-y-auto p-2 space-y-3">

          {/* COMPANY */}
          <section className="border rounded-md p-2 bg-white">
            <h2 className="text-sm font-semibold border-l-4 border-blue-700 pl-2">
              Company Financial Year Mapping
            </h2>

            <Controller
              control={control}
              name="companyId"
              render={({ field }) => (
                <select
                  className="border p-2 w-full mt-2"
                  value={field.value || ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    field.onChange(val);
                    handleCompanyChange(val);
                  }}
                >
                  <option value="">Select Company</option>
                  {companies.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </section>

          {/* UNMAPPED */}
          <section className="border rounded-md p-2 bg-white">
            <h3 className="font-semibold mb-2">Unmapped Financial Years</h3>

            <DataGrid dataSource={unmappedList} keyExpr="id" showBorders height={200}>
              <Column dataField="findesc" caption="Year" />
              <Column dataField="finstdt" caption="Start Date" />
              <Column dataField="finenddt" caption="End Date" />

              <Column
                caption="Select"
                cellRender={(cell) => (
                  <input
                    type="radio"
                    checked={selectedFinyear === cell.data.id}
                    onChange={() => setSelectedFinyear(cell.data.id)}
                  />
                )}
              />
            </DataGrid>
          </section>

          {/* MAPPED */}
          <section className="border rounded-md p-2 bg-white">
            <h3 className="font-semibold mb-2">Mapped Financial Years</h3>

            <DataGrid dataSource={mappedList} keyExpr="id" showBorders height={200}>
              <Column dataField="findesc" caption="Year" />
              <Column dataField="finstdt" caption="Start Date" />
              <Column dataField="finenddt" caption="End Date" />
              <Column dataField="statusdesc" caption="Status" />
            </DataGrid>
          </section>

        </div>

        {/* FOOTER */}
        <div className="border-t p-2 flex justify-end gap-3 bg-gray-50">
          <button
            type="submit"
            className="primary-btn"
            disabled={!selectedFinyear || !selectedCompany}
          >
            Save
          </button>

          <button type="button" className="secondary-btn">
            Exit
          </button>
        </div>

      </form>
    </div>
  );
}