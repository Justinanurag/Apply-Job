import { toast } from "sonner";
import Swal from "sweetalert2";

const swalBase = {
  background: "oklch(0.18 0.03 270)",
  color: "#fff",
  confirmButtonColor: "oklch(0.72 0.20 295)",
  cancelButtonColor: "oklch(0.45 0.02 270)",
};

export const notify = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  info: (message: string) => toast.info(message),
  loading: (message: string) => toast.loading(message),
  dismiss: (id?: string | number) => toast.dismiss(id),
};

export const alertSuccess = (title: string, text?: string) =>
  Swal.fire({
    ...swalBase,
    icon: "success",
    title,
    text,
    confirmButtonText: "OK",
  });

export const alertError = (title: string, text?: string) =>
  Swal.fire({
    ...swalBase,
    icon: "error",
    title,
    text,
    confirmButtonText: "OK",
  });

export const alertInfo = (title: string, text?: string) =>
  Swal.fire({
    ...swalBase,
    icon: "info",
    title,
    text,
    confirmButtonText: "OK",
  });

export const confirmAction = async (title: string, text?: string) => {
  const result = await Swal.fire({
    ...swalBase,
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
  });
  return result.isConfirmed;
};
