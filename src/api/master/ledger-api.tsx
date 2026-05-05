import notify from "devextreme/ui/notify";
import { apiCall } from "../../utils/apiClient";


// export const fetchLedgerGroupList = async (userId: string | number | null, companyId: string | number | null) => {
//   try {
//     const response: any = await apiCall.get(
//       `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}ledgergroup`,
//       {
//         userid: userId,
//         compid: companyId,
//       }
//     );

//     if (response?.error) {
//       notify(response.error, "error", 3000);
//       return [];
//     }

//     return response.data.map((item: any) => ({
//       id: item.id,
//       name: item.ledgergroup,
//       subledgertype: item.ledgergroupid,

//     }));
//   } catch (e: any) {
//     console.error(e);
//     notify(String(e), "error", 3000);
//     return [];
//   }
// };


export const fetchLedgerGroupList = async (
  userId: string | number | null,
  companyId: string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}ledgergroup`,
      {
        userid: userId,
        compid: companyId,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response?.data ?? [];

  } catch (error) {
    console.error("fetchLedgerGroupList error:", error);
    return [];
  }
}

export const fetchVendorList = async (
  userId: string | number | null,
  companyId: string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}vendor`,
      {
        userid: userId,
        compid: companyId,
        skip: 0,
        take: 200,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response?.data ?? [];

  } catch (error) {
    console.error("fetchVendorList error:", error);
    return [];
  }
}

export const fetchGodownList = async (
  userId: string | number | null,
  companyId: string | number | null,
  branchid?: string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}godown`,
      {
        userid: userId,
        compid: companyId,
        branchid: branchid,
        // skip: 0,
        // take: 200,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response?.data ?? [];

  } catch (error) {
    console.error("fetchGodownList error:", error);
    return [];
  }
}

export const fetchPurLedgerList = async (userId: string | number | null, skip: string | number | null,
  take: string | number | null, groupid: string | number | null,
  search: string | number | null, grouptype: string | number | null,
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}ledger`,
      {
        userid: userId,
        skip: skip,
        take: take,
        groupid: groupid,
        search: search,
        grouptype: grouptype,
        // compid: companyId,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.ledgername,
      // ledgergroupid: item.ledgergroupid,

    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
export const fetchSubledgerEntryTypeList = async (userId: string | number | null, companyId: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}ledgergroup`,
      {
        userid: userId,
        compid: companyId,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.subledgertype,
      ledgergroupid: item.ledgergroupid,
      ledgergroup: item.ledgergroup,

    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
export const fetchSubledgerTypeList = async (userId: string | number | null, Nature?: string | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}subledgertype`,
      {
        userid: userId,
        nature: Nature,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.subledgertype,
      ledgergroupid: item.ledgergroupid,
      ledgergroup: item.ledgergroup,

    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

export const fetchStateList = async (
  userId: string | number | null,
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}state`,
      {
        userid: userId,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response?.data ?? [];

  } catch (error) {
    console.error("fetchStateList error:", error);
    return [];
  }
}

export const fetchCityList = async (
  userId: string | number | null,
  stateid: string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}city`,
      {
        userid: userId,
        stateid: stateid,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response?.data ?? [];

  } catch (error) {
    console.error("fetchCityList error:", error);
    return [];
  }
}

export const fetchTdsSectionList = async (userId: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}tdssection`,
      {
        userid: userId,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,

    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
export const fetchCorporateGroupList = async (userId: string | number | null, companyId: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}corpgroup`,
      {
        userid: userId,
        compid: companyId,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,

    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
// export const fetchCompanySelectionList = async (userId: string | number | null,
//   id: string | number | null) => {
//   try {
//     const response: any = await apiCall.get(
//       `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}company`,
//       {
//         userid: userId,
//         id: id,
//       }
//     );

//     if (response?.error) {
//       notify(response.error, "error", 3000);
//       return [];
//     }

//     return response.data.map((item: any) => ({
//       id: item.id,
//       name: item.name,
//     }));
//   } catch (e: any) {
//     console.error(e);
//     notify(String(e), "error", 3000);
//     return [];
//   }
// };

export const fetchCompanySelectionList = async (
  userId: string | number | null,
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}companyselection`,
      {
        userid: userId,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response?.data ?? [];

  } catch (error) {
    console.error("fetchCompanySelectionList error:", error);
    return [];
  }
}


export const fetchUserGpList = async (
  userId: string | number | null,

) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}/usergroup`,
      {
        userid: userId || 0,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data;
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
export const fetchUserList = async (
  userId: string | number | null,

) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}/user`,
      {
        userid: userId || 0,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data;
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

export const fetchUserGroupList = async (
  userId: string | number | null,
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}usergroup`,
      {
        userid: userId,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response?.data ?? [];

  } catch (error) {
    console.error("fetchUserGroupList error:", error);
    return [];
  }
}


// For Branch User Mapping  Pages
export const fetchUserNameList = async (userid: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}user`,
      {
        userid: userid,
        // stateid: stateid,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      //cityid: item.cityid,


    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
export const fetchCompanyList = async (userid: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}company`,
      {
        userid: userid,
        // stateid: stateid,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      //cityid: item.cityid,


    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

// export const fetchBranchList = async (userid: string | number | null) => {
//   try {
//     const response: any = await apiCall.get(
//       `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}branch`,
//       {
//         userid: userid,
//         // stateid: stateid,
//       }
//     );

//     if (response?.error) {
//       notify(response.error, "error", 3000);
//       return [];
//     }

//     return response.data.map((item: any) => ({
//       id: item.id,
//       name: item.name,
//       //cityid: item.cityid,


//     }));
//   } catch (e: any) {
//     console.error(e);
//     notify(String(e), "error", 3000);
//     return [];
//   }
// };

export const fetchBranchList = async (
  userId: string | number | null,
  compid: string | number | null,
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}branch`,
      {
        userid: userId,
        compid: compid,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response?.data ?? [];

  } catch (error) {
    console.error("fetchBranchList error:", error);
    return [];
  }
}

// export const fetchUsersList = async (userid: string | number | null) => {
//   try {
//     const response: any = await apiCall.get(
//       `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}user`,
//       {
//         userid: userid,
//       }
//     );

//     if (response?.error) {
//       notify(response.error, "error", 3000);
//       return [];
//     }

//     return response.data.map((item: any) => ({
//       id: item.id,
//       name: item.name,
//       //cityid: item.cityid,
//     }));
//   } catch (e: any) {
//     console.error(e);
//     notify(String(e), "error", 3000);
//     return [];
//   }
// };

export const fetchUsersList = async (
  userId: string | number | null,
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}user`,
      {
        userid: userId,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response?.data ?? [];

  } catch (error) {
    console.error("fetchUsersList error:", error);
    return [];
  }
}

export const fetchAccoutHeadList = async (userid: string | number | null, skip: string | number | null,
  take: string | number | null, grouptype: string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}ledger`,
      {
        userid: userid,
        skip: skip,
        take: take,
        grouptype: grouptype

      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.ledgername,
      //cityid: item.cityid,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
export const fetchAccoutPostingLedgerList = async (userid: string | number | null, skip: string | number | null,
  take: string | number | null, extracondition: string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}ledger`,
      {
        userid: userid,
        skip: skip,
        take: take,
        extracondition: extracondition,


      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.ledgername,
      //cityid: item.cityid,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

