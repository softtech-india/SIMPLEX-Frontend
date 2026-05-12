export interface DirectSaleItem {
    tag?: string;
    sl?: number;
    dtlid?: number;

    pcategoryid?: number;
    pcategorynm?: string;
    productid: number;
    productnm?: string;
    qty1: number;
    rate?: number;

    value?: number;
    discpct?: number;
    discamt?: number;
    netval?: number;
    taxablerate?: number;
    taxableval?: number;
    taxid?: number;
    taxval?: number;
    finalval?: number;
    stockval?: number;
    cgstpct?: number;
    cgstval?: number;
    cgstledgerid?: number;
    sgstpct?: number;
    sgstval?: number;
    sgstledgerid?: number;
    igstpct?: number;
    igstval?: number;
    igstledgerid?: number;
    hsnid?: number;
    hsnno?: string;
    mrp?: number;
    orderdtlid?: number;
}

export interface DirectSale {
    id: number;

    compid?: number | string;
    branchid?: number | string;
    finid?: number;
    vnumid?: number;
    vnummethod?: string;

    billdt?: string;
    billno?: string;

    billtypeid: number;
    billtypenm?: string;

    customerid: number;
    customernm?: string;

    cashcrtype?: string;
    crdays?: number;

    qty1?: number;
    qtyrateval?: number;

    discval?: number;
    netval?: number;
    beftaxval?: number;
    taxableval?: number;
    taxval?: number;
    amtwithtaxval?: number;
    afttaxval?: number;
    billamt?: number;
    sgstval?: number;
    cgstval?: number;
    igstval?: number;

    smid?: number;
    smnm?: string;

    godownid: number;
    godownnm?: string;

    saledgerid: number;
    saledgernm?: string;

    transporterid: number;
    transporterName?: string;

    narration?: string;

    billtime?: string;

    aprvstatus?: string;
    qrcode?: string;

    // Order based sale
    orderid?: number;
    orderno?: string;
    orderdt?: string;

    itemdtl?: DirectSaleItem[];

    entryby?: number;
    entrydt?: string;
    updateby?: number;
    updatedt?: string;
}

export interface DirectSaleFormType
    extends Partial<
        Omit<
            DirectSale,
            "id" | "entryby" | "entrydt" | "updateby" | "updatedt" | "Approve" | "Confirmed"
        >
    > { }

export interface DirectSaleApiResponse {
    success: boolean;
    message: string;
    data: DirectSale[];
}

export type OperationMode = "Add" | "Edit" | "Delete" | "View" | "Print" | "Approve";