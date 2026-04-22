import notify from "devextreme/ui/notify";
import { apiCall } from "../../utils/apiClient";


export const fetchSeriesList = async (
  userId: string | number | null,
  compId: string | number | null, 
  branchId: string | number | null, 
  voucherType: string | number | null,
  finid: string | number | null,
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}vouchernumbering`,
      {
        userid: userId,
        compid: compId,
        branchid: branchId,
        vouchertype: voucherType,
        finid: finid,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      manualallow: item.manualallow,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};


export const fetchBillTypeList = async (userId: string | number | null,
  vouchertype: string | number | null ) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}billtype`,
      {
        userid: userId,
        billtype: vouchertype,

      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      accountheadid: item.accountheadid,
      accountheadnm: item.accountheadnm,
      taxregion: item.taxregion,
      typeoftransaction: item.typeoftransaction,
      istaxinclude: item.istaxinclude,
      isdefault: item.isdefault,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

export const fetchPtfileImportList = async (userId: string | number | null,
  compid: string | number | null, vendorid: string | number | null, tagstatus: string | null, id: number | null ) => {
  try {
    let apiUrl = "";

    if (tagstatus === "N") {
      apiUrl = `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}ptfileimport`;
    } else if (tagstatus === "A") {
      apiUrl = `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}ptfileimport/id`;
    }

    const response: any = await apiCall.get(
      apiUrl,
      {
        userid: userId,
        compid: compid,
        vendorid: vendorid,
        tagstatus: tagstatus === "A" ? null : "N",
        id: id === 0 ? null : id,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
    id: item.id,
    name: item.invno,
    invno: item.invno,
    invdt: parseDMY(item.invdt),
    vendor: item.vendor,
    brandid: item.brandid,
    brand: item.brand,
    partyBillNo: item.partyBillNo ?? "",
    partybilldt: item.partybilldt ?? "",
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

const parseDMY = (d: string) => {
  if (!d) return null;
  const [day, month, year] = d.split("/");
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const fetchPtfileDetailList = async (userId: string | number | null,
  compid: string | number | null,id: string | number | null ) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}ptfiledetail`,
      {
        userid: userId,
        compid: compid,
        id: id,

      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
    dtlid: item.dtlid,
    productnm: item.productnm ?? "",
    styleno: item.styleno ?? "",
    fit: item.fit ?? "",
    size: item.size ?? "",
    colour: item.colour ?? "",
    mrp: item.mrp ?? 0,
    dp: item.dp ?? 0,
    qty: item.qty ?? 0,
    value: item.value ?? 0,
    hsn: item.hsn ?? "",
    cgstpct: item.cgstpct ?? 0,
    cgstval: item.cgstval ?? 0,
    sgstpct: item.sgstpct ?? 0,
    sgstval: item.sgstval ?? 0,
    igstpct: item.igstpct ?? 0,
    igstval: item.igstval ?? 0,
    taxval: item.taxval ?? 0,
    finalval: item.finalval ?? 0,
    productid: item.productid ?? 0,
    styleid: item.styleid ?? 0,
    sizeid: item.sizeid ?? 0,
    fitid: item.fitid ?? 0,

    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
// /
export const fetchBillsundryList = async (userId: string | number | null,
  compid: string | number | null,id: string | number | null ) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}billsundry`,
      {
        userid: userId,
        compid: compid,
        id: id,
        vouchertype: "PU",
        beforeaftertag: "A"

      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
    dtlid: item.dtlid,
    productnm: item.productnm ?? "",
    styleno: item.styleno ?? "",
    fit: item.fit ?? "",
    size: item.size ?? "",
    colour: item.colour ?? "",
    mrp: item.mrp ?? 0,
    dp: item.dp ?? 0,
    qty: item.qty ?? 0,
    value: item.value ?? 0,
    hsn: item.hsn ?? "",
    cgstpct: item.cgstpct ?? 0,
    cgstval: item.cgstval ?? 0,
    sgstpct: item.sgstpct ?? 0,
    sgstval: item.sgstval ?? 0,
    igstpct: item.igstpct ?? 0,
    igstval: item.igstval ?? 0,
    taxval: item.taxval ?? 0,
    finalval: item.finalval ?? 0,
    productid: item.productid ?? 0,
    styleid: item.styleid ?? 0,
    sizeid: item.sizeid ?? 0,
    fitid: item.fitid ?? 0,

    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};

export const fetchSalesmanList = async (userId: string | number | null,
  compid: string | number | null, branchid: string | number | null ) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}salesman`,
      {
        userid: userId,
        compid: compid,
        branchid: branchid,

      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      mobno: item.mobno,
      branchid: item.branchid,
      branchnm: item.branchnm,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};
