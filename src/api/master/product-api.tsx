import notify from "devextreme/ui/notify";
import { apiCall } from "../../utils/apiClient";

export const fetchProductList = async (
  userId: string | number | null,
  companyId: string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}product`,
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
    console.error("fetchProductList error:", error);
    return [];
  }
}

// export const fetchProductList = async ({
//   userId,
//   companyId,
//   brandId = 0,
//   groups = "",
//   classId = "",
//   skip = 0,
//   take = 100,
//   searchText = "",
//   segmentId = 0,
// }: {
//   userId: string | number | null;
//   companyId: string | number | null;
//   brandId?: number;
//   groups?: string | number | null;
//   classId?: string | number | null;
//   skip?: number;
//   take?: number;
//   searchText?: string;
//   segmentId?: string | number;
// }) => {
//   try {
//     const response: any = await apiCall.get(
//       `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}model`,
//       {
//         userid: Number(userId) || 0,
//         compid: Number(companyId) || 0,
//         brandid: brandId ?? 0,
//         groups: groups ?? "",
//         classid: classId ?? "",
//         skip,
//         take,
//         searchtext: searchText,
//         segmentid: segmentId ?? 0,
//       }
//     );

//     if (response?.error) {
//       notify(response.error, "error", 3000);
//       return [];
//     }

//     return response.data.map((item: any) => ({
//       id: item.id,
//       name: item.model,
//       mrp: item.mrp,
//       dp: item.dp,
//       dealersalrerate: item.dealersalrerate,
//       dealerdiscpct: item.dealerdiscpct,
//       dealersupportamt: item.dealersupportamt,
//       // bprice: item.bprice,
//       // minpct: item.minpct,
//       // minslrate: item.minslrate,
//       // pcatgname: item.pcatgname,
//       // pclsname: item.pclsname,
//       // pclstag: item.pclstag,
//       // group: item.group,
//       // uname: item.uname,
//       // tcode: item.tcode,
//       // tname: item.tname,
//       // cgst: item.cgst,
//       // sgst: item.sgst,
//       // igst: item.igst,
//       // hsn: item.hsn,
//       // hsndesc: item.hsndesc,
//       // rateapplicable: item.rateapplicable,
//     }));
//   } catch (e: any) {
//     console.error(e);
//     notify(String(e), "error", 3000);
//     return [];
//   }
// };

export const fetchBrandList = async (
  userId: string | number | null,
  companyId: string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}brand`,
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
      name: item.brand,
      salesmanid: item.salesmanid,
      salesman: item.salesman,
      rsoid: item.rsoid,
      rso: item.rso,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

export const fetchSegmentList = async (
  userId: string | number | null,
  companyId: string | number | null,
  brandId: string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}productsegment`,
      {
        userid: userId,
        compid: companyId,
        brandid: brandId ?? 0,
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

export const fetchProductGroupList = async ({
  userId,
  companyId,
  brandId = 0,
  segmentId = 0,
}: {
  userId: string | number | null;
  companyId: string | number | null;
  brandId?: string | number | null;
  segmentId?: string | number | null;
}
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}productgroup`,
      {
        userid: userId,
        compid: companyId,
        brandid: brandId ?? 0,
        segmentid: segmentId ?? 0,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.group,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

export const fetchProductClassList = async ({
  userId,
  companyId,
  brandId = 0,
  segmentId = 0,
}: {
  userId: string | number | null;
  companyId: string | number | null;
  brandId?: string | number | null;
  segmentId?: string | number | null;
}) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}productclass`,
      {
        userid: userId,
        compid: companyId,
        brandid: brandId ?? 0,
        segmentid: segmentId ?? 0,        
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.pclsname,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

export const fetchSubClassList = async (userId: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}subclass`,
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

export const fetchUnitList = async (userId: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}unit`,
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
      name: item.unit,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

export const fetchHsnList = async (userId: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}hsn`,
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
      name: item.hsn,
      gstId: item.gstId,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

export const fetchGstList = async (userId: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}gst`,
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
      name: item.gst,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
