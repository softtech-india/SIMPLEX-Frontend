export interface DealerLedgerParams {
	userid: number;
	compid: number;
	startdt: string;
	enddt: string;
	reqnarration: 0 | 1;
	brandid: number;
	skip?: number;
	take?: number;
	brandwise?: 0 | 1;
	pdc?: 0 | 1;
}

export interface DealerLedgerRow {
	transdt: string;
	transno: string;
	refno: string;
	transtype: string;
	particulars: string;
	debitamt: number;
	creditamt: string;
	tramt: number;
	tramtdrcrtype: string;
	closingamt: string;
	brand: string;
	narration: string;
	transid: number;
	transdtlid: number;
	trnature: string;
}

export interface DealerLedgerResponse {
	data: DealerLedgerRow[];
	errormessage: string;
	dealerid: number;
	dealer: string;
	totdebt: number;
	totcrdt: number;
	totclamt: number;
	totclamtdrcrtype: string;
	totalcount: number;
}
