import Swal from "sweetalert2";

const swal = Swal.mixin({
  customClass: {
    container: "swal-zindex",
    popup: "swal-popup-zindex"
  },
  didOpen: (dialog) => {

    const backdrop = document.querySelector(".swal2-backdrop-show") as HTMLElement;
    const popup = dialog as HTMLElement;

    if (backdrop) {
      backdrop.style.zIndex = "99999";
    }
    if (popup) {
      popup.style.zIndex = "100000";
    }
  }
});

export const confirmDelete = async (
  title: string = "Are you sure?",
  text: string = "You won't be able to revert this!"
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Yes, delete it!",
    allowOutsideClick: false,
    allowEscapeKey: true,
    width: '350px',       
    padding: '10px',    
    customClass: {
      title: 'text-sm',          
      popup: 'text-xs',         
      confirmButton: 'px-1 py-1 text-xs', 
      cancelButton: 'px-1 py-1 text-xs', 
    },
  });

  return result.isConfirmed;
};

export const showSuccess = (message: string = "Action completed successfully!") => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'text-xs', 
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};

export const showError = (message: string = "Something went wrong!") => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "error",
    title: "Error",
    text: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'text-xs', 
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
};

export const showToast = (message: string) => {
  swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 2000
  });
};