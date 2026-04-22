import notify from "devextreme/ui/notify";
import { apiCall } from "../../utils/apiClient";

export const fetchStyleList = async (
  userId: string | number | null,
  skip: number = 0,
  take: number = 500000,
  productid:number,

) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}style`,
      {
        userid: Number(userId) || 0,
        skip,
        take,
        productid,
     
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

export const fetchStyleProductList = async (
      userId: string | number | null,
      skip: number = 0,
      take: number = 500000,
      brand: string | number | null,
      genericgroup: string | number | null,
      itemgroup:string | number | null,
      search:string | number | null
) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}product`,
      {
        userid: Number(userId) || 0,
        skip  ,
        take  ,
        brand:brand,
        genericgroup:genericgroup,
        itemgroup:itemgroup,
        search:search
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
        id: item.id,
        name: item.pname,
        // pcode: item.pcode,
        // alias: item.alias,
        // brandid: item.brandid,
        // brand: item.brand,
        // classid: item.classid,
        // classnm: item.classnm,
        // itemgroupid: item.itemgroupid,
        // itemgroup: item.itemgroup,
        // unitid: item.unitid,
        // unit: item.unit,
        // altunitid: item.altunitid,
        // altunit: item.altunit,
        // factor: item.factor,
        // factortype: item.factortype,
        // factortypedesc: item.factortypedesc,
        // method: item.method,
        // methoddesc: item.methoddesc,
        // ptype: item.ptype,
        // ptypeDesc: item.ptypeDesc,
        // minlevel: item.minlevel,
        // reorderlevel: item.reorderlevel,
        // valuation: item.valuation,
        // valuationdesc: item.valuationdesc,
        // reqbcode: item.reqbcode,
        // reqbcodedesc: item.reqbcodedesc,
        // bcodemode: item.bcodemode,
        // bcodemodedesc: item.bcodemodedesc,
        // srate: item.srate,
        // prate: item.prate,
        // minsrate: item.minsrate,
        // mrp: item.mrp,
        // serviceType: item.serviceType,
        // serviceTypedesc: item.serviceTypedesc,
        // hsnid: item.hsnid,
        // hsnNo: item.hsnNo,
        // gstid: item.gstid,
        // gstName: item.gstName,
        // srateon: item.srateon,
        // srateondesc: item.srateondesc,
        // prateon: item.prateon,
        // prateondesc: item.prateondesc,
        // status: item.status,
        // statusdesc: item.statusdesc,
        // subclassid: item.subclassid,
        // subclassnm: item.subclassnm,
        // entryby: item.entryby,
        // entrydt: item.entrydt,
        // updateby: item.updateby,
        // updatedt: item.updatedt
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};


export const fetchFitList = async (userId: string | number | null) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}productgroup`,
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
      name: item.itemgroup,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};


