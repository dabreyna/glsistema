"use client";

import { PDFViewer } from "@react-pdf/renderer";
import dynamic from "next/dynamic";
import React from "react";

const DynamicReceiptPDF = dynamic(() => import("@/components/client/dashboard/caja/reciboPDF"), {
    ssr: false,
});

interface PDFViewerComponentProps {
    infoRecibo: {
        idRecibo: number;
        idContrato: number;
    };
}

const PDFViewerRecibo: React.FC<PDFViewerComponentProps> = ({ infoRecibo }) => {
    return (
        <div style={{ width: "100%", height: "80vh" }}>
            <PDFViewer style={{ width: "100%", height: "100%" }}>
                <DynamicReceiptPDF infoRecibo={infoRecibo} />
            </PDFViewer>
        </div>
    );
};

export default PDFViewerRecibo;
