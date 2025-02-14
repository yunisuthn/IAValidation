import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { t } from "i18next";

const ConfirmDialog = ({ title, message, resolve, container }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (confirmed) => {
        setOpen(false);
        setTimeout(() => {
            resolve(confirmed); // Resolve the Promise
            document.body.removeChild(container); // Clean up the portal
        }, 300);
    };

    return (
        <Dialog open={open} onClose={() => handleClose(false)} className="p-2">
            <DialogTitle>{title || "Confirmation"}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message || "Are you sure you want to proceed?"}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button size="small" onClick={() => handleClose(false)} color="secondary">
                    {t('cancel')}
                </Button>
                <Button size="small" onClick={() => handleClose(true)} color="primary" variant="contained">
                    {t('confirm')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const confirmDialog = (title, message) => {
    return new Promise((resolve) => {
        const container = document.createElement("div");
        document.body.appendChild(container);
        const root = createRoot(container);
        root.render(<ConfirmDialog title={title} message={message} resolve={resolve} container={container} />);
    });
};
