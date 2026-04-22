import React, { useState, useRef, useCallback, useEffect } from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import notify from 'devextreme/ui/notify';
import { isEmpty } from 'lodash';
import { Popup, Position } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import PrintConfirmationBox from '../printConfirmationBox';

export default function ConfirmationBox(props) {
    const {
        closeConfirmationModal, componentRef, object, ComponentToPrint,
        saveConfirmation, onObjectPrint, onPrintComplete,
    } = props;
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    function closePrintConfirmationModal(e) {
        setIsPrintModalOpen(false);
        if (onPrintComplete) onPrintComplete(); //  Close parent modal after print
    }
    function openPrintModal(e) {
        setIsPrintModalOpen(true);
    }
    function renderPopup() {
        return (
            <div className='transaction-confirmation-entry-form'>
                <div className="row">
                    <div className='col-12'>
                        Do you want to print ?
                    </div>
                </div>
                <div className="row">
                    <div className='col-6'>
                    </div>
                    <div className='col-6'>
                        <Button icon="print"
                            width={80}
                            type="default"
                            stylingMode="contained"
                            text="Yes"
                            onClick={openPrintModal} />&nbsp;
                        <Button
                            width={100}
                            type="default"
                            stylingMode="contained"
                            text="No"
                            onClick={closeConfirmationModal} />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <>
            <Popup
                width={460}
                height={120}
                showTitle={true}
                showCloseButton={false}
                title={"Confirmation"}
                dragEnabled={false}
                hideOnOutsideClick={true}
                visible={saveConfirmation}
                contentRender={renderPopup}
            />
            <PrintConfirmationBox isPrintModalOpen={isPrintModalOpen} closePrintConfirmationModal={closePrintConfirmationModal} onObjectPrint={onObjectPrint} componentRef={componentRef} object={object} ComponentToPrint={ComponentToPrint} />
        </>
    );
}