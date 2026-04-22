import React, { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { Popup, Position } from 'devextreme-react/popup';
import { Button } from 'devextreme-react/button';
import { isEmpty } from 'lodash';

export default function Report(props) {
    const { reportName, closeConfirmationModal, saveConfirmation, selectedReportAction
    } = props;
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    function closePrintConfirmationModal(e) {
        setIsPrintModalOpen(false);
    }
    function openPrintModal(e) {

    }

    function renderPopup(props) {
        let LazyComponent = null;
        debugger
        if (reportName === "Stock-Trial") {
            LazyComponent = React.lazy(() =>
                import("../../../modules/report/stockstatusreport/stockstatuscriteria")
            );
        } else if (reportName === "GST-Register (Output)") {
            LazyComponent = React.lazy(() =>
                import("../../../modules/report/stockstatusreport/stockstatuscriteria")
            );            
        } else if (reportName === "Sales-Register") {
            LazyComponent = React.lazy(() =>
                import("../../../modules/report/stockstatusreport/stockstatuscriteria")
            );
        } else if (reportName === "Purchase-Register") {
            LazyComponent = React.lazy(() =>
                import("../../../modules/report/stockstatusreport/stockstatuscriteria")
            );
        } else {
            LazyComponent = React.lazy(() =>
                import("../../../modules/report/stockstatusreport/stockstatuscriteria")
            );
        }
        return (
            <div className='report-confirmation-entry-form'>
                {!isEmpty(selectedReportAction) && <div className="row">
                    <Suspense fallback={<div>Loading...</div>} >
                        <LazyComponent />
                    </Suspense>
                </div>}
            </div>
        );
    }

    return (
        <>
            <Popup
                width={560}
                height={"auto"}
                showTitle={true}
                onHiding={closeConfirmationModal}
                showCloseButton={true}
                title={reportName.replace("-", " ")}
                dragEnabled={false}
                hideOnOutsideClick={false}
                visible={saveConfirmation}
                contentRender={renderPopup}
            />
            <div className='report-confirmation-entry-form'>

            </div>
        </>
    )
};