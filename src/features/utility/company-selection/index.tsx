'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import useUserStore from '@/store/userStore';
import useCompanyStore from '@/store/useCompanyStore';



export default function CompanySelectionModule() {

  // Hooks
  const { userId, companyId, branchId, finid, branchnm } = useUserStore();

  // State 





  return (
    <>
      <div className="purchase-order-module ">

        <div className="bg-white rounded-xl shadow-sm border mt-2">

          <h2>Select New Company</h2>


        </div>


      </div>
    </>
  );
}