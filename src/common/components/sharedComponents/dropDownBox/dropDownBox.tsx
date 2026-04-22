// // CustomDropDownBox.tsx
// import React from "react";
// import DropDownBox from "devextreme-react/drop-down-box";
// import List from "devextreme-react/list";
// import styles from "./dropDownBox.module.css";
// import type { DropDownBoxProps, DropDownBoxOption } from "./dropDownBox.model";
// import type { ItemClickEvent } from "devextreme/ui/list";

// const CustomDropDownBox: React.FC<DropDownBoxProps> = ({
//   label,
//   options,
//   value,
//   placeholder = "Select...",
//   disabled = false,
//   onChange,
//   width = "100%",
// }) => {
//   const [currentValue, setCurrentValue] = React.useState<string | number | null>(value);

//   React.useEffect(() => {
//     setCurrentValue(value); // keep in sync with parent
//   }, [value]);

//   const handleItemClick = (e: ItemClickEvent<DropDownBoxOption, string | number>) => {
//     if (e.itemData) {
//       const newValue = e.itemData.value;
//       setCurrentValue(newValue);
//       onChange(newValue);
//     }
//   };

//   const handleValueChanged = (e: any) => {
//     if (e.value === null) {
//       // ✅ user clicked clear
//       setCurrentValue(null);
//       onChange(null);
//     }
//   };


// const contentRender = () => (
//   <List
//     dataSource={options}
//     keyExpr="value"
//     displayExpr="label"
//     selectionMode="single"
//     selectedItemKeys={currentValue ? [currentValue] : []}
//     onItemClick={handleItemClick}
//   />
// );


//   return (
//     <div className={styles.wrapper}>
//       {label && <label className={styles.label}>{label}</label>}
//       <DropDownBox
//         value={currentValue}
//         valueExpr="value"
//         displayExpr="label"
//         placeholder={placeholder}
//         disabled={disabled}
//         width={width}
//         showClearButton={true}
//         contentRender={contentRender}
//         onValueChanged={handleValueChanged}
//         className={styles.dropdown}
//       />
//     </div>
//   );
// };

// export default CustomDropDownBox;



// import React from "react";
// import DropDownBox from "devextreme-react/drop-down-box";
// import DataGrid, { Column, Selection } from "devextreme-react/data-grid";
// import styles from "./dropDownBox.module.css";
// import type { DropDownBoxProps } from "./dropDownBox.model";

// const CustomDropDownBox: React.FC<DropDownBoxProps> = ({
//   label,
//   options,
//   value,
//   placeholder = "Select...",
//   disabled = false,
//   onChange,
//   width = "100%",
// }) => {
//   const [currentValue, setCurrentValue] = React.useState<string | number | null>(value);

//   React.useEffect(() => {
//     setCurrentValue(value);
//   }, [value]);

//   const handleSelectionChanged = (e: any) => {
//     const selected = e.selectedRowKeys[0] ?? null;
//     setCurrentValue(selected);
//     onChange(selected);
//   };

//   const handleValueChanged = (e: any) => {
//     if (e.value === null) {
//       setCurrentValue(null);
//       onChange(null);
//     }
//   };

//   const contentRender = () => (
//     <DataGrid
//       dataSource={options}
//       keyExpr="value"
//       showBorders={true}
//       hoverStateEnabled={true}
//       selectedRowKeys={currentValue ? [currentValue] : []}
//       onSelectionChanged={handleSelectionChanged}
//       height={250}
//     >
//       <Selection mode="single" />
//       <Column dataField="value" caption="Code" />
//       <Column dataField="label" caption="Name" />
//     </DataGrid>
//   );

//   return (
//     <div className={styles.wrapper}>
//       {label && <label className={styles.label}>{label}</label>}
//       <DropDownBox
//         value={currentValue}
//         valueExpr="value"
//         displayExpr="label"
//         placeholder={placeholder}
//         disabled={disabled}
//         width={width}
//         showClearButton={true}
//         contentRender={contentRender}
//         onValueChanged={handleValueChanged}
//         className={styles.dropdown}
//       />
//     </div>
//   );
// };

// export default CustomDropDownBox;
