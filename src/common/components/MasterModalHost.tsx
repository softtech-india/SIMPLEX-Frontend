import { CustomerForm } from "@/features/master/account-master/customer/components/CustomerForm";
import { VendorForm } from "@/features/master/account-master/vendor/components/VendorForm";
import { ProductForm } from "@/features/master/inventory-master/product/components/ProductForm";

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

    default:
      return null;
  }
}