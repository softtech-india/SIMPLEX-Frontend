import React, { useState, useEffect } from 'react';
import notify from 'devextreme/ui/notify';
import { Popup } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import { CheckBox } from 'devextreme-react';

export default function PrintConfirmationBox(props) {
    const {
        closePrintConfirmationModal,
        componentRef,
        object,
        ComponentToPrint,
        isPrintModalOpen,
        onObjectPrint,
    } = props;

    const [printOptions, setPrintOptions] = useState({
        buyersCopy: true,
        sellersCopy: true,
        transporterCopy: true,
        duplicateCopy: false,
    });

    // Reset options when popup opens
    useEffect(() => {
        if (isPrintModalOpen) {
            setPrintOptions({
                buyersCopy: true,
                sellersCopy: true,
                transporterCopy: true,
                duplicateCopy: false,
            });
        }
    }, [isPrintModalOpen]);

    function renderPopup() {
        return (
            <div className='transaction-confirmation-entry-form' style={{ padding: 10 }}>
                <div className="row">
                    <div className='col-6'>Buyer's Copy</div>
                    <div className='col-6'>
                        <CheckBox
                            value={printOptions.buyersCopy}
                            onValueChange={(e) => setPrintOptions({ ...printOptions, buyersCopy: e })}
                        />
                    </div>

                    <div className='col-6'>Seller's Copy</div>
                    <div className='col-6'>
                        <CheckBox
                            value={printOptions.sellersCopy}
                            onValueChange={(e) => setPrintOptions({ ...printOptions, sellersCopy: e })}
                        />
                    </div>

                    <div className='col-6'>Transporter Copy</div>
                    <div className='col-6'>
                        <CheckBox
                            value={printOptions.transporterCopy}
                            onValueChange={(e) => setPrintOptions({ ...printOptions, transporterCopy: e })}
                        />
                    </div>

                    <div className='col-6'>Duplicate Copy</div>
                    <div className='col-6'>
                        <CheckBox
                            value={printOptions.duplicateCopy}
                            onValueChange={(e) => setPrintOptions({ ...printOptions, duplicateCopy: e })}
                        />
                    </div>
                </div>

                <br />

                <div className='row'>
                    <div className='col-6'></div>
                    <div className='col-6'>
                        <Button
                            icon="print"
                            width={80}
                            type="default"
                            stylingMode="contained"
                            text="Yes"
                            disabled={
                                !printOptions.buyersCopy &&
                                !printOptions.sellersCopy &&
                                !printOptions.transporterCopy &&
                                !printOptions.duplicateCopy
                            }
                            onClick={() => onObjectPrint(printOptions)}
                        />

                        &nbsp;

                        <Button
                            width={80}
                            type="default"
                            stylingMode="contained"
                            text="No"
                            onClick={closePrintConfirmationModal}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Popup */}
            <Popup
                width={460}
                height={240}
                showTitle={true}
                title="Print"
                dragEnabled={false}
                showCloseButton={false}
                hideOnOutsideClick={true}
                visible={isPrintModalOpen}
                contentRender={renderPopup}
            />

            {/* Hidden print content (important: outside popup) */}
            <div style={{ display: "none" }}>
                <ComponentToPrint
                    ref={componentRef}
                    object={object}
                    printOptions={printOptions}
                />
            </div>
        </>
    );
}

// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import Toolbar, { Item } from 'devextreme-react/toolbar';
// import notify from 'devextreme/ui/notify';
// import { isEmpty } from 'lodash';
// import { Popup, Position } from 'devextreme-react/popup';
// import { Button } from 'devextreme-react/button';
// import { CheckBox } from 'devextreme-react';
// import { jsPDF } from 'jspdf';
// import html2canvas from 'html2canvas';

// export default function PrintConfirmationBox(props) {
//     const {
//         closePrintConfirmationModal, componentRef, object, ComponentToPrint,
//         isPrintModalOpen, onObjectPrint,
//     } = props;
//     const [printOptions, setPrintOptions] = useState({ buyersCopy: true, sellersCopy: true, transporterCopy: true, duplicateCopy: true, });

//     function printDocument() {
//         const input = document.getElementById('component-to-print');
//         html2canvas(input)
//             .then((canvas) => {
//                 const imgData = canvas.toDataURL('image/png');
//                 const pdf = new jsPDF();
//                 pdf.addImage(imgData, 'JPEG', 0, 0);
//                 // pdf.output('dataurlnewwindow');
//                 pdf.save("download.pdf");
//             });
//     }

//     function onValueChangeBuyersCopy(e) {
//         setPrintOptions({ ...printOptions, buyersCopy: e });
//     }
//     function onValueChangeSellersCopy(e) {
//         setPrintOptions({ ...printOptions, sellersCopy: e });
//     }
//     function onValueChangeTransporterCopy(e) {
//         setPrintOptions({ ...printOptions, transporterCopy: e });
//     }
//     function onValueChangeDuplicateCopy(e) {
//         setPrintOptions({ ...printOptions, duplicateCopy: e });
//     }

//     useEffect(() => {
//         setPrintOptions({ buyersCopy: true, sellersCopy: true, transporterCopy: true, duplicateCopy: false });
//     }, []);

//     function renderPopup() {
//         return (
//             <div className='transaction-confirmation-entry-form'>
//                 <div className="row">
//                     <div className='col-6'>
//                         Buyers Copy
//                     </div>
//                     <div className='col-6'>
//                         <CheckBox value={printOptions.buyersCopy} onValueChange={onValueChangeBuyersCopy} />
//                     </div>
//                     <div className='col-6'>
//                         Seller's Copy
//                     </div>
//                     <div className='col-6'>
//                         <CheckBox value={printOptions.sellersCopy} onValueChange={onValueChangeSellersCopy} />
//                     </div>
//                     <div className='col-6'>
//                         Transporter Copy
//                     </div>
//                     <div className='col-6'>
//                         <CheckBox value={printOptions.transporterCopy} onValueChange={onValueChangeTransporterCopy} />
//                     </div>
//                     <div className='col-6'>
//                         Duplicate Copy
//                     </div>
//                     <div className='col-6'>
//                         <CheckBox value={printOptions.duplicateCopy} onValueChange={onValueChangeDuplicateCopy} />
//                     </div>
//                 </div>
//                 <br />
//                 <div className="row">
//                     <div className='col-6'>
//                     </div>
//                     <div className='col-6'>
//                         <Button icon="print"
//                             width={80}
//                             type="default"
//                             disabled={!printOptions.buyersCopy && !printOptions.sellersCopy && !printOptions.transporterCopy && !printOptions.duplicateCopy}
//                             stylingMode="contained"
//                             text="Yes"
//                             onClick={onObjectPrint} 
//                             />
//                             &nbsp;
//                         <Button
//                             width={100}
//                             type="default"
//                             stylingMode="contained"
//                             text="No"
//                             onClick={closePrintConfirmationModal} 
//                         />
//                         {/* <ComponentToPrint ref={componentRef} object={object} printOptions={printOptions} /> */}
//                     </div>
//                 </div>
//             </div>
//         );
//     }
//     return (
//         <>
//             <Popup
//                 width={460}
//                 height={180}
//                 showTitle={true}
//                 showCloseButton={false}
//                 title={"Print"}
//                 dragEnabled={false}
//                 hideOnOutsideClick={true}
//                 visible={isPrintModalOpen}
//                 contentRender={renderPopup}
//             />

//             {/* Keep outside popup and invisible */}
//             <div style={{ display: "none" }}>
//                 <ComponentToPrint ref={componentRef} object={object} printOptions={printOptions} />
//             </div>
//         </>
//     );
// }

