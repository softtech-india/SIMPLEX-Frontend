export const salesmanTypes = [{
    id: 'S',
    name: 'Retail Salesman',
}, {
    id: 'D',
    name: 'Dealer Salesman',
}, {
    id: 'R',
    name: 'RSO',
},
];

export const hsnTags = [
    {
        id: 1,
        name: 'Yes'
    },
    {
        id: 2,
        name: 'No'
    }
];

export const paymentTypes = [{
    id: 'S',
    name: 'Cash',
}, {
    id: 'C',
    name: 'Credit Card',
}, {
    id: 'D',
    name: 'Debit Card',
},
{
    id: 'Q',
    name: 'Cheque',
},
];

export const activeClosedTags = [{
    id: 'A',
    name: 'Active',
}, {
    id: 'C',
    name: 'Closed',
},
];

export const costcenterApplicableTags = [{
    id: 'Y',
    name: 'Yes',
}, {
    id: 'N',
    name: 'No',
},
];

export const taxTypesTags = [
    { id: "NA", name: "NA" },
    { id: "VT", name: "VAT" },
    { id: "CS", name: "CST" },
    { id: "AD", name: "Add. Tax/Schg. on VAT" },
    { id: "ST", name: "Service Tax" },
    { id: "XE", name: "Excise" },
    { id: "TD", name: "TDS" },
    { id: "OT", name: "Others" },
    { id: "GT", name: "GST" },
];

export const cashCreditTags = [
    { id: "C", name: "Cash" },
    { id: "R", name: "Credit" },
];

export const methodTags = [
    { id: "A", name: "Auto" },
    { id: "M", name: "Manual" },

]
export const seriesTags = [
    { id: "P", name: "Purchase" },
    { id: "A", name: "Auto" }
];
export const billTypesTags = [
    { id: "NA", name: "NA" },
    // IGST   
    { id: "IGST_IW_TAX_INCL_SALES", name: "I/GST-Item Wise Tax Incl Sales" },
    { id: "IGST_IW_TAX_PURCHASE", name: "I/GST-Item Wise Tax Purchase" },
    { id: "IGST_IW_TAX_SALES", name: "I/GST-Item Wise Tax Sales" },
    { id: "IGST_SINGLE_TAX_PURCHASE", name: "I/GST-Single Tax Purchase" },
    { id: "IGST_SINGLE_TAX_SALES", name: "I/GST-Single Tax Sales" },
    { id: "IGST_Purchase", name: "IGST Purchase" },
    // LGST
    { id: "LGST_IW_TAX_INCL_SALES", name: "L/GST-Item Wise Tax Incl Sales" },
    { id: "LGST_IW_TAX_PURCHASE", name: "L/GST-Item Wise Tax Purchase" },
    { id: "LGST_IW_TAX_SALES", name: "L/GST-Item Wise Tax Sales" },
    { id: "LGST_SINGLE_TAX_PURCHASE", name: "L/GST-Single Tax Purchase" },
    { id: "LGST_SINGLE_TAX_SALES", name: "L/GST-Single Tax Sales" },

];

export const interestMethodTags = [
    { id: "N", name: "None" },
    { id: "M", name: "Monthly" },
    { id: "Q", name: "Quarterly" },
    { id: "H", name: "Halfyearly" },
    { id: "Y", name: "Yearly" },
];

export const salaryDeductTypeTags = [
    { id: "NS", name: "Non Salary" },
    { id: "PF", name: "PF" },
    { id: "ES", name: "ESI" },
    { id: "PT", name: "PTAX" },
    { id: "TD", name: "TDS" },
    { id: "AD", name: "ADVANCE" },
    { id: "BO", name: "BONUS" },
    { id: "SA", name: "Salary" },
];

export const cardWalletTags = [
    { id: "N", name: "None" },
    { id: "C", name: "Card" },
    { id: "W", name: "E-Wallet" },
];

export const yesNoTags = [{
    id: 'Y',
    name: 'Yes',
}, {
    id: 'N',
    name: 'No',
},
];
export const soStatusTags = [{
    id: 'P',
    name: 'Order Booked',
}, {
    id: 'C',
    name: 'Invoice Processed',
},
];



export const reqNarrationTags = [{
    id: 'Y',
    name: 'Yes',
}, {
    id: 'N',
    name: 'No',
},
];
export const taxRegistrationTags = [{
    id: 'R',
    name: 'Registered',
}, {
    id: 'U',
    name: 'Un-Registered',
}, {
    id: 'S',
    name: 'SEZ',
}, {
    id: 'C',
    name: 'Composition',
},
];

export const NumberingMethodTags = [{
    id: 'A',
    name: 'Auto',
}, {
    id: 'M',
    name: 'Manual',
},
];

export const SummaryDetailTags = [{
    id: 'S',
    name: 'Product Summary',
}, {
    id: 'M',
    name: 'Product MRP Summary',
},
];

export const allSingleTags = [{
    id: 'A',
    name: 'All',
}, {
    id: 'S',
    name: 'Single',
},
];

export const GpLogicTags = [{
    id: 'T',
    name: 'On Taxable',
}, {
    id: 'I',
    name: 'On Include Tax',
},
];

export const RoiLogicTags = [{
    id: '0',
    name: 'With ROI',
}, {
    id: '1',
    name: 'Without ROI',
},
];

export const PurRegReportTypes = [{
    id: '0',
    name: 'Purchase',
}, {
    id: '1',
    name: 'All Receive',
},
];

export const financialMonths = [
    { name: "April", number: 4 },
    { name: "May", number: 5 },
    { name: "June", number: 6 },
    { name: "July", number: 7 },
    { name: "August", number: 8 },
    { name: "September", number: 9 },
    { name: "October", number: 10 },
    { name: "November", number: 11 },
    { name: "December", number: 12 },
    { name: "January", number: 1 },
    { name: "February", number: 2 },
    { name: "March", number: 3 },
];

export const genderTags = [{
    id: 'M',
    name: 'Male',
}, {
    id: 'F',
    name: 'Female',
}, {
    id: 'T',
    name: 'Transgender',
},
];

export const barcodeModeTags = [{
    id: 'S',
    name: 'Single',
}, {
    id: 'M',
    name: 'Multiple',
},
];

export const roundOptions = [{
    id: 0,
    name: 'None',
}, {
    id: 1,
    name: 'One Rupee',
}
];

export const category = [{
    id: 'N',
    name: 'Normal',
}, {
    id: 'I',
    name: 'Nil Rated',
},
{
    id: 'E',
    name: 'Exempted',
},
{
    id: 'G',
    name: 'Non Gst',
},
{
    id: 'Z',
    name: 'Zero Rated',
}
];

export const goodsServiceTags = [{
    id: 'G',
    name: 'Goods',
}, {
    id: 'S',
    name: 'Service',
},
];

export const deducteeTypeTags = [{
    id: '01',
    name: 'Company',
}, {
    id: '02',
    name: 'Other than Company',
}, {
    id: '00',
    name: 'NA',
},
];

export const addlessTags = [{
    id: 'A',
    name: 'Add',
}, {
    id: 'L',
    name: 'Less',
},
];

export const flatpercentTags = [{
    id: 'F',
    name: 'Flat',
}, {
    id: 'P',
    name: 'Percent',
},
];

export const calcmethodTags = [{
    id: 'IV',
    name: 'Item Value',
}, {
    id: 'TV',
    name: 'Taxable Value',
}, {
    id: 'BM',
    name: 'Before Misc.',
},
];

export const companyStatus = [{
    id: 'P',
    name: 'Partnership',
}, {
    id: 'O',
    name: 'Propritership',
},
{
    id: 'L',
    name: 'Limited',
},
{
    id: 'V',
    name: 'Pvt.Ltd.',
},
{
    id: 'N',
    name: 'Non Profitable',
},
];

export const openCloseTags = [{
    id: 'O',
    name: 'Open',
}, {
    id: 'C',
    name: 'Close',
},
];

export const Usertype = [{
    id: 'U',
    name: 'User',
}, {
    id: 'S',
    name: 'Super User',
},
{
    id: 'M',
    name: 'Management User',
},
{
    id: 'A',
    name: 'Admin',
},
];

export const StateDispalytype = [{
    id: 'A',
    name: 'All',
}, {
    id: 'S',
    name: 'Selected',
}
];

export const BackdateEntrytype = [{
    id: 'N',
    name: 'No',
}, {
    id: 'Y',
    name: 'Yes',
}
];

export const Statustype = [
    {
        id: 'A',
        name: 'Active',
    },
    {
        id: 'C',
        name: 'Close',
    }
];

export const goodsServiceType = [
    {
        id: 'G',
        name: "Goods"
    },
    {
        id: "S",
        name: "Service"
    }
]
export const productType = [
    {
        id: 'RM',
        name: "Raw Material"
    },
    {
        id: "FG",
        name: "Finished Goods"
    }
]
export const valuationType = [
    {
        id: 'A',
        name: "Auto"
    },
    {
        id: "M",
        name: "Manual"
    }
]
export const batchRequire = [
    {
        id: 'Y',
        name: "Yes"
    },
    {
        id: "N",
        name: "No"
    }
]
export const unitFactorType = [
    {
        id: 'M',
        name: "Multiplication"
    },
    {
        id: "D",
        name: "Division"
    }
]
export const unitMethod = [
    {
        id: 'A',
        name: "Automatic"
    },
    {
        id: "M",
        name: "Manual"
    }
]
export const purchaseRateOn = [
    {
        id: 1,
        name: "First Quantity"
    },
    {
        id: 2,
        name: "Second Quantity"
    }
]
export const salesRateOn = [
    {
        id: 1,
        name: "First Quantity"
    },
    {
        id: 2,
        name: "Second Quantity"
    }
]
export const productStatus = [
    {
        id: 'A',
        name: "Active"
    },
    {
        id: 'C',
        name: "Closed"
    }
]

export const allonlyOpTags = [
    {
        id: '0',
        name: 'All',
    },
    {
        id: '1',
        name: 'Only Opening',
    }
];

export const balanceTags = [
    {
        id: '0',
        name: 'Only Balance',
    },
    {
        id: '1',
        name: 'All',
    }
];
export const saleRegisterformatTags = [
    {
        id: '0',
        name: 'All'
    },
    {
        id: '1',
        name: 'Only Sales'
    },
    {
        id: '2',
        name: 'Sales Return'
    }
];
export const reportType = [
    {
        id: 'S',
        name: 'Summary'
    },
    {
        id: 'D',
        name: 'Detail'
    }
];
export const gstregformatTags = [
    {
        id: '0',
        name: 'Normal',
    },
    {
        id: '1',
        name: 'Detail',
    }
];

export const itcTags = [
    {
        id: '0',
        name: 'Eligible',
    },
    {
        id: '1',
        name: 'Ineligible',
    },
    {
        id: '2',
        name: 'All',
    }
];

export const rcmTags = [
    {
        id: 'A',
        name: 'All',
    },
    {
        id: 'N',
        name: 'No',
    },
    {
        id: 'Y',
        name: 'Yes',
    }
];

export const gstr1CriteriaTags = [
    {
        id: '0',
        name: 'All',
    },
    {
        id: '1',
        name: 'B2b Invoice',
    },
    {
        id: '2',
        name: 'B2C(Large) Invoices',
    },
    {
        id: '3',
        name: 'B2C(Small) Invoices',
    },
    {
        id: '4',
        name: 'Credit/Debit Notes (Register)',
    },
    {
        id: '5',
        name: 'Credit/Debit Notes (Un-Register)',
    },
    {
        id: '6',
        name: 'Nil Rated Invoices',
    },
    {
        id: '7',
        name: 'Export Invoices',
    }
];

export const accountSpecificTypes = [

    {
        id: 'SG',
        name: 'Here',
    },
    {
        id: 'VU',
        name: 'In Voucher',
    }
];
export const applicableInTypes = [
    {
        id: 'N',
        name: 'Normal',
    },
    {
        id: 'P',
        name: 'POS',
    }
];

export const purchaseTypes = [
    {
        id: 'PU',
        name: 'Purchase',
    },
    {
        id: 'SA',
        name: 'Sale',
    }
];

export const taxApplicableTypes = [
    {
        id: 'ST',
        name: 'Single Tax',
    },
    {
        id: 'IT',
        name: 'ItemWise Tax',
    },
    {
        id: 'IM',
        name: 'ItemWise Miscellaneous',
    },
    {
        id: 'ITM',
        name: 'ItemWise Tax & Miscellaneous',
    },
    {
        id: 'NTA',
        name: 'Not Applicable',
    }
];

export const taxIncludePriceTypes = [
    {
        id: 'N',
        name: 'No',
    },
    {
        id: 'Y',
        name: 'Yes',
    }
];

export const taxRegionTypes = [

    {
        id: 'L',
        name: 'Local',
    },
    {
        id: 'C',
        name: 'Central',
    }
];
export const typesTransactionTypes = [
    {
        id: 'OT',
        name: 'Other',
    },
    {
        id: 'TR',
        name: 'IntraState Stock Transfer',
    },
    {
        id: 'TE',
        name: 'InterState Stock Transfer',
    },
    {
        id: 'SZ',
        name: 'SEZ - With Payment',
    },
    {
        id: 'SW',
        name: 'SEZ - Without Payment',
    },
    {
        id: 'EX',
        name: 'Export - With Payment',
    },
    {
        id: 'EW',
        name: 'Export - Without Payment',
    },
    {
        id: 'DE',
        name: 'Deemed Export',
    }
];

export const addLessTypes = [
    {
        id: 'A',
        name: 'Add',
    },
    {
        id: 'L',
        name: 'Less',
    },
    {
        id: 'K',
        name: 'Ask',
    }
];
export const beforeAfterTypes = [
    {
        id: 'B',
        name: 'Before',
    },
    {
        id: 'A',
        name: 'After',
    }
];
export const roundingLogicTypes = [
    {
        id: "0",
        name: 'None',
    },
    {
        id: "1",
        name: '1 Rupees',
    }
];
export const calculationMethodTypes = [
    {
        id: 'F',
        name: 'Flat',
    },
    {
        id: 'P',
        name: 'Percentage',
    }
];
export const calculationOnTypes = [
    {
        id: 'IV',
        name: 'Item Value',
    },
    {
        id: 'TV',
        name: 'Taxable Value',
    },
    {
        id: 'BM',
        name: 'Before Misc',
    },
    {
        id: 'SM',
        name: '2 Before Misc',
    },
    {
        id: 'FQ',
        name: 'Quantity',
    },
    {
        id: 'AQ',
        name: 'Alt. Qty',
    },
    {
        id: 'CV',
        name: 'On Cumulative Value',
    }
];
export const taxNatureTypes = [
    {
        id: 'OT',
        name: 'Others',
    }
];
export const statusTypes = [
    {
        id: 'A',
        name: 'Active',
    },
    {
        id: 'C',
        name: 'Close',
    }
];

export const paymentmodeTags = [{
    id: 'C',
    name: 'Cash',
}, {
    id: 'B',
    name: 'Bank',
}, {
    id: 'A',
    name: 'Account Transfer',
},
];

export const filterorderType = [
    { id: 'A', name: 'Total Orders' },
    { id: 'P', name: 'Waiting for Approval' },
    { id: 'D', name: 'Delivered Orders' },
    { id: 'U', name: 'Under Execution' },
];

export const allowNegetive = [
    {
        id: 'Y',
        name: 'Yes'
    },
    {
        id: 'N',
        name: 'No'
    }
];
export const isCardeWallet = [
    {
        id: 'N',
        name: 'None'
    },
    {
        id: 'C',
        name: 'Card'
    },
    {
        id: 'W',
        name: 'E-wallet'
    }
];
export const salaryDeducTtype = [
    {
        id: 'NS',
        name: 'Non Salary'
    }
];

export const costcenterApplicable = [
    {
        id: 'N',
        name: "No"
    },
    {
        id: 'Y',
        name: "Yes"
    }
];
export const interestMethod = [
    {
        id: 'N',
        name: "None"
    },
    {
        id: 'Y',
        name: "Yearly"
    }
];

export const ledgerStatus = [
    {
        id: 'A',
        name: "Active"
    },
    {
        id: 'C',
        name: "Closed"
    }
];

export const stockEffect = [
    {
        id: 'N',
        name: "No"
    }
];

export const taxNature = [
    {
        id: 'NA',
        name: "NA"
    }
];

export const isMainLedger = [
    {
        id: 'N',
        name: 'No',
    },
    {
        id: 'Y',
        name: 'Yes',
    }
];

export const gstregType = [
    {
        id: 'U',
        name: 'Unregistered',
    },
    {
        id: 'R',
        name: 'Registered',
    },
    {
        id: 'C',
        name: 'Composition',
    },
    {
        id: 'S',
        name: 'SEZ',
    }
];

export const maintainBillwise = [
    {
        id: 'N',
        name: 'No',
    },
    {
        id: 'Y',
        name: 'Yes',
    }
];

export const isTdsApplicable = [
    {
        id: 'N',
        name: 'No'
    },
    {
        id: 'Y',
        name: "Yes"
    }
]

export const futuredateallowType = [
    {
        id: 'Y',
        name: 'Yes',
    },
    {
        id: 'N',
        name: 'No',
    }
];
export const manualallowType = [
    {
        id: 'Y',
        name: 'Yes',
    },
    {
        id: 'N',
        name: 'No',
    }
];

export const billType = [
    {
        id: 'SA',
        gType: "S",
        name: 'Sale',
    },
    {
        id: 'PU',
        gType: "P",
        name: 'Purchase',
    }
]

export const taxRegion = [
    {
        id: 'L',
        name: 'Local',
    },
    {
        id: 'C',
        name: 'Central',
    }
];
export const transactionType = [
    {
        id: 'OT',
        name: 'Other',
    },
    {
        id: 'ST',
        name: 'Stock Transfer',
    },
    {
        id: 'SZ',
        name: 'SEZ-with Payment',
    },
    {
        id: 'SW',
        name: 'SEZ-without Payment',
    },
    {
        id: 'EX',
        name: 'Export-with Payment',
    },
    {
        id: 'EW',
        name: 'Export-without Payment',
    },
    {
        id: 'DE',
        name: 'Deemed Export',
    },
];

export const taxApplicable = [
    {
        id: 'ST',
        name: 'Single Tax',
    },
    {
        id: 'IT',
        name: 'Itemwise tax',
    },
    {
        id: 'IM',
        name: 'Itemwise Miscellaneous',
    },
    {
        id: 'ITM',
        name: 'Itemwise tax & Miscellaneous',
    },
];
export const isTaxInclude = [
    {
        id: "Y",
        name: "Yes"
    },
    {
        id: "N",
        name: "No"
    }
]
export const isDefault = [
    {
        id: "Y",
        name: "Yes"
    },
    {
        id: "N",
        name: "No"
    }
]
export const StatusOfBillType = [
    {
        id: "Y",
        name: "Yes"
    },
    {
        id: "N",
        name: "No"
    }
]
export const salesManStatus = [
    {
        id: "A",
        name: "Active"
    },
    {
        id: "C",
        name: "Closed"
    }
]