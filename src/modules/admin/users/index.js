import React, { useState, useRef, useCallback, useEffect } from 'react';
import LoadPanel from 'devextreme-react/load-panel';
import DataGrid, {
    Column,
    Editing,
    Popup,
    Scrolling, Pager, Paging, Selection, ColumnChooser, Button, Export,
    Lookup, Toolbar,
    Form, FilterRow, HeaderFilter, Search, SearchPanel,
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import { Item } from 'devextreme-react/form';
import { GetUsers, GetRoles, SaveUsers } from '../../../api/admin/users/users-api.js';
import notify from 'devextreme/ui/notify';
import { isEmpty, filter } from 'lodash';
import { useRouter } from 'next/router';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid as excelExport } from 'devextreme/excel_exporter';
import { exportDataGrid as pdfExport } from 'devextreme/pdf_exporter';
import BarManager from '../../../common/components/barmanager/index';
import { jsPDF } from 'jspdf';
import { yesNoTags, allSingleTags } from '../../../common/utility/data.js';

export default function Users(props) {
    const [users, setUsers] = useState([]);
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    const [loader, setLoader] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [id, setId] = useState(0);
    const [roles, setRoles] = useState([]);
    const [priviledge, setPriviledge] = useState({});
    const router = useRouter();

    const grdList = React.createRef();

    const getRoles = useCallback(() => {
        setLoader(true);
        GetRoles(accessToken)
            .then(response => {
                setRoles(response);
                setLoader(false);
            })
            .catch((e) => {
                console.log(e);
                notify(e, "error", 3000);
                setLoader(true);
            });
    });

    const getUsers = useCallback(() => {
        setLoader(true);
        GetUsers(accessToken)
            .then(response => {
                setUsers(response);
                setLoader(false);
            })
            .catch((e) => {
                console.log(e);
                notify(e, "error", 3000);
                setLoader(true);
            });
    });

    useEffect(() => {
        var userPriviledge = JSON.parse(localStorage.getItem("userPriviledge"));
        var itemPriviledges = userPriviledge.rawPriviledges;
        let itemPriviledge = filter(
            itemPriviledges, function (e) {
                return e.path == router.asPath;
            }
        );
        if (!isEmpty(itemPriviledge)) {
            setPriviledge(itemPriviledge[0]);
        }
    }, []);

    useEffect(() => { getUsers(); }, [accessToken]);
    useEffect(() => { getRoles(); }, [accessToken]);

    async function onSaved(e) {
        debugger
        let dataList = e.changes;
        const arrayList = [];
        dataList.map(user => {
            if (user.type == "remove") {
                var item = selectedRow;
                item.flag = user.type;
                arrayList.push(item);
            }
            else {
                var item = user.data;
                if (user.type == "insert") {
                    item.id = 0;
                }
                item.flag = user.type;
                arrayList.push(item);
            }

        });
        var response = await SaveUsers(arrayList, accessToken);
        if (response.hasOwnProperty("code")) {
            notify("Data successfully saved.", "success", 3000);
        }
        else {
            notify("Data not successfully saved." + response.Error, "error", 3000);
        }
    }

    function onSelectionChanged(e) {
        const selected = e.selectedRowsData?.[0];
        if (selected) {
            setSelectedRowIndex(e.component.getRowIndexByKey(selected.id));
            setSelectedRow(selected);
        } else {
            setSelectedRowIndex(-1);
            setSelectedRow({});
        }
    }

    function addItem(e) {
        setId(0);
        grdList.current.instance.addRow();
    }
    function editItem(e) {
        if (isEmpty(selectedRow)) {
            notify("Please select a record.", "error", 3000);
            return;
        }
        else {
            setId(selectedRow.id);
            grdList.current.instance.editRow(selectedRowIndex);
        }
    }
    function deleteItem(e) {
        if (isEmpty(selectedRow)) {
            notify("Please select a record.", "error", 3000);
            return;
        }
        else {
            setId(selectedRow.id);
            grdList.current.instance.deleteRow(selectedRowIndex);
        }
    }
    function refreshList(e) {
        getUsers();
    }
    function onColumnChooser(e) {
        var grid = grdList.current.instance;
        grid.showColumnChooser();
    }
    function search(e) {
        refreshList();
    }
    function viewItem(e) {
        editItem(e);
    }
    function onExporting(e) {
        if (process.env.NEXT_PUBLIC_EXPORT_FILE_TYPE == "pdf") {
            const doc = new jsPDF();
            pdfExport({
                component: grdList.current.instance,
                jsPDFDocument: doc,
                indent: 5,
            }).then(() => {
                doc.save('Users.pdf');
            });
        }
        else {
            const workbook = new Workbook();
            const worksheet = workbook.addWorksheet('Main sheet');
            exportDataGrid({
                component: grdList.current.instance,
                worksheet,
                autoFilterEnabled: true,
            }).then(() => {
                workbook.xlsx.writeBuffer().then((buffer) => {
                    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Users.xlsx');
                });
            });
        }
    }

    return (
        <div id="div-users">
            <BarManager priviledge={priviledge} addItem={addItem} editItem={editItem} deleteItem={deleteItem} viewItem={viewItem} refreshList={refreshList} search={search} onExporting={onExporting} onColumnChooser={onColumnChooser} isTransaction={false} />

            <DataGrid
                dataSource={users}
                ref={grdList}
                keyExpr="id"
                showBorders={true}
                hoverStateEnabled={true}
                focusedRowEnabled={true}
                allowColumnResizing={true}
                onSelectionChanged={onSelectionChanged}
                onSaved={onSaved}
                onExporting={onExporting}
                onInitNewRow={(e) => {
                    e.data.isActive = true; // sets checkbox checked by default
                    e.data.backDate_Entry = yesNoTags[1]?.id;
                    e.data.state_Display = allSingleTags[1]?.id;
                }}                
            >
                <Selection mode="single" />
                <Scrolling rowRenderingMode='virtual'></Scrolling>
                <Paging defaultPageSize={15} />
                <Pager
                    visible={true}
                    allowedPageSizes={[15, 25, 50, 'all']}
                    displayMode={'full'}
                    showPageSizeSelector={true}
                    showInfo={true}
                    showNavigationButtons={true} />
                <FilterRow visible={true} />
                <HeaderFilter visible={true} />
                <LoadPanel enabled={true} />
                <Editing mode="popup" >
                    <Popup title="User Info" showTitle={true} width={700} height={285} />
                    <Form>
                        <Item dataField="userName" />
                        <Item dataField="userCode" />
                        <Item dataField="userPassword" />
                        <Item dataField="roleId" />
                        <Item dataField="phoneNumber" />
                        <Item dataField="email" />
                        <Item dataField="backDate_Entry" />
                        <Item dataField="state_Display" />
                        <Item dataField="isActive" />

                    </Form>
                </Editing>
                <Column dataField="userName" />
                <Column dataField="userCode" width={170} />
                <Column dataField="roleId" caption="Role" width={125}>
                    <Lookup dataSource={roles} valueExpr="id" displayExpr="roleName" />
                </Column>
                <Column dataField="phoneNumber" />
                <Column dataField="email" />
                <Column dataField="backDate_Entry" caption="Back Date Entry" width={120}>
                    <Lookup dataSource={yesNoTags} valueExpr="id" displayExpr="name" />
                </Column>
                <Column dataField="state_Display" caption="State Display" width={120}>
                    <Lookup dataSource={allSingleTags} valueExpr="id" displayExpr="name" />
                </Column>
                <Column dataField="isActive" width={120} />
                <Column dataField="userPassword" visible={false} />
                <Column dataField="flag" visible={false} />
            </DataGrid>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                visible={loader}
                showIndicator={true}
            />
        </div>
    );
}