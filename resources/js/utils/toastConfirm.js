import React from 'react';
import { toast } from 'react-toastify';

export default function toastConfirm(message, opts = {}) {
  const { okText = 'OK', cancelText = 'Cancel', closeOnClick = false } = opts;

  return new Promise((resolve) => {
    let toastId = null;

    const handleConfirm = () => {
      if (toastId !== null) toast.dismiss(toastId);
      resolve(true);
    };

    const handleCancel = () => {
      if (toastId !== null) toast.dismiss(toastId);
      resolve(false);
    };

    const Content = () => (
      <div style={{ maxWidth: 360 }}>
        <div style={{ marginBottom: 8 }}>{message}</div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-secondary me-2" onClick={handleCancel}>{cancelText}</button>
          <button className="btn btn-sm btn-primary" onClick={handleConfirm}>{okText}</button>
        </div>
      </div>
    );

    toastId = toast.info(<Content />, {
      autoClose: false,
      closeOnClick: closeOnClick,
      closeButton: false,
      draggable: false
    });
  });
}
