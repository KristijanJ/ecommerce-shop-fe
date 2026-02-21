import { useEffect } from "react";

interface ModalProps {
  title: string;
  content: React.ReactNode;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
  confirmText?: string;
  cancelText?: string;
  customButtons?: React.ReactNode;
}

function Modal({
  title,
  content,
  open,
  onConfirm,
  onClose,
  confirmText = "Confirm",
  cancelText = "Cancel",
  customButtons,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/10 flex justify-center items-center z-10"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {content}

        <>
          {customButtons ? (
            customButtons
          ) : (
            <div className="flex justify-center gap-2">
              <button
                onClick={onConfirm}
                className="bg-primary text-white px-4 py-2 rounded cursor-pointer"
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="bg-error text-white px-4 py-2 rounded cursor-pointer"
              >
                {cancelText}
              </button>
            </div>
          )}
        </>
      </div>
    </div>
  );
}

export default Modal;
