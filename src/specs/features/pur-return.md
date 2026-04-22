# Feature: Purchas Return Transaction (Purchas Return Entry / POS)

---

## 1. Goal
Allow users to create and manage a purchase return with header details, multiple product line items, GST calculation, discounts handling.

---

## 2. Pages Covered
- /purchasereturn/new
- /purchasereturn/edit/:id
- /purchasereturn/view/:id

---

## 3. Sales Header Fields

### Voucher & Bill Details
| Field | Type | Validation / Rule |
|------|------|------------------|
| tag | string | Nullable |
| vnumid | number | Required, must be > 0 |
| vnummethod | string | Required (M = Manual, A = Auto) |
| billno | string | Required if vnummethod = "M" |
| billdt | date | Required |
| billtime | date | Required |

---

### Bill Type & Ledger
| Field | Type | Validation |
|------|------|-----------|
| billtypeid | number | Required, must be > 0 |
| puledgerid | number | Required |
| puledgernm | string | Display only |

---

### Customer Information
| Field | Type | Validation |
|------|------|-----------|
| vendorid | number | Optional |
| cashcrtype | string | Required (Cash / Credit) |

---

### Purchase Return Meta
| Field | Type | Validation |
|------|------|-----------|
| narration | string | Optional |

---

## 4. Product Grid (Purchase Return Line Items)

Each sales bill contains multiple product rows.

### ProductRow Fields
| Field | Type | Description |
|------|------|-------------|
| sl | number | Serial number |
| tag | string | I / U / D |
| dtlid | number | Detail id |
| barcodeid | number | Barcode master id |
| barcodeno | string | Barcode number |
| productid | number | Product id |
| productnm | string | Product name |
| qty | number | Must be > 0 |
| rate | number | Selling rate |
| value | number | qty × rate |
| discpct | number | Discount percentage |
| discamt | number | Discount amount |
| netval | number | value − discamt |
| taxableval | number | Taxable value |
| taxid | number | Tax master id |
| taxval | number | Total tax |
| finalval | number | netval + taxval |
| stockval | number | Stock valuation |
| mrp | number | Maximum retail price |

---

### GST / Tax Breakup
| Field | Type |
|------|------|
| cgstpct | number |
| cgstval | number |
| cgstledgerid | number |
| sgstpct | number |
| sgstval | number |
| sgstledgerid | number |
| igstpct | number |
| igstval | number |
| igstledgerid | number |

---

### Product Classification
| Field | Type |
|------|------|
| hsnid | number |
| styleid | number |
| sizeid | number |
| fitid | number |

---

## 5. Business Rules

### Voucher Rules
- If vnummethod = "M", billno is mandatory
- If vnummethod = "A", billno is system generated

---

### Product Rules
- Quantity cannot exceed available stock
- Sale return quantity cannot exceed sold quantity
- Duplicate barcode increases quantity instead of adding new row

---

### Tax Rules
- CGST + SGST for intra-state sales
- IGST for inter-state sales
- Tax calculated at line-item level

---

### Discount Rules
- Line discount applied before tax
- Lumpsum discount applied at bill level
- Exchange value deducted from net payable

---

## 6. Calculations

### Per Product Row
value = qty × rate
discamt = value × (discpct / 100)
netval = value − discamt
taxval = cgstval + sgstval + igstval
finalval = netval + taxval

### Bill Level
Gross Total = Σ netval
Total Tax = Σ taxval
Net Payable = Gross Total + Total Tax − lumpsumpdisc − exchangevalue


---

## 7. API Reference
Detailed API contracts are defined in:

- specs/api/sales-api.md

---

## 8. Error Scenarios
- Invalid voucher type
- Duplicate manual bill number
- Insufficient stock
- Invalid tax configuration
- Missing mandatory fields

---

## 9. Non-Functional Requirements
- Save operation < 1 second
- Atomic transaction (header + details)
- Rollback on failure
- Audit log for edit and cancel

---

## 10. Spec Usage
All UI, API, and validation logic must follow this specification.

