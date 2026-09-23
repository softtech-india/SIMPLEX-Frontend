import { CustomerForm } from "@/features/master/account-master/customer/components/CustomerForm";
import { VendorForm } from "@/features/master/account-master/vendor/components/VendorForm";
import { ProdCategoryForm } from "@/features/master/inventory-master/product-category/components/ProdCategoryForm";
import { ProdClassForm } from "@/features/master/inventory-master/product-class/components/ProdClassForm";
import { ProdGroupForm } from "@/features/master/inventory-master/product-group/components/ProdGroupForm";
import { ProductForm } from "@/features/master/inventory-master/product/components/ProductForm";
import { HSNForm } from "@/features/master/other-master/hsn/components/HSNForm";

import { useMasterModal } from "@/hooks/useMasterModal";

export function MasterModalHost() {
  const { modal, close, resolve } = useMasterModal();

  if (!modal.visible) return null;

  switch (modal.type) {

    case "vendor":
      return (
        <VendorForm
          visible
          mode="Add"
          formVendorId={0}
          returnAfterSave={true}
          onClose={close}
          onSuccess={(data) => resolve(data)}
        />
      );

    case "product":
      return (
        <ProductForm
          visible
          mode="Add"
          ProductId={0}
          returnAfterSave={true}
          onClose={close}
          onSuccess={(data) => resolve(data)}
        />
      );

    case "customer":
      return (
        <CustomerForm
          visible
          mode="Add"
          formCustomerId={0}
          returnAfterSave={true}
          onClose={close}
          onSuccess={(data) => resolve(data)}
        />
      );

    case "prodcategory":
      return (
        <ProdCategoryForm
          visible
          mode="Add"
          ProdCategoryId={0}
          returnAfterSave={true}
          onClose={close}
          onSuccess={(data) => resolve(data)}
        />
      );

    case "prodclass":
      return (
        <ProdClassForm
          visible
          mode="Add"
          ProdClassId={0}
          returnAfterSave={true}
          onClose={close}
          onSuccess={(data) => resolve(data)}
        />
      );

    case "prodgroup":
      return (
        <ProdGroupForm
          visible
          mode="Add"
          ProdGroupId={0}
          returnAfterSave={true}
          onClose={close}
          onSuccess={(data) => resolve(data)}
        />
      );

    case "hsn":
      return (
        <HSNForm
          visible
          mode="Add"
          HSNId={0}
          returnAfterSave={true}
          onClose={close}
          onSuccess={(data) => resolve(data)}
        />
      );


    default:
      return null;
  }
}