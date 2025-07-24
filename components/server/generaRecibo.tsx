"use server";

import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { promises as fs } from "fs";
import path from "path";

// Define the data structure
interface ReceiptData {
    idContrato: number;
    idRecibo: number;
}

// PDF Document Component
const PDFDocument = ({ data }: { data: ReceiptData }) => {
    const styles = StyleSheet.create({
        page: {
            flexDirection: "column",
            padding: 40,
            fontFamily: "Helvetica",
        },
        header: {
            fontSize: 24,
            marginBottom: 20,
            textAlign: "center",
            fontWeight: "bold",
        },
        section: {
            marginBottom: 10,
            fontSize: 12,
        },
        label: {
            fontWeight: "bold",
            marginRight: 5,
        },
        value: {
            marginBottom: 5,
        },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Receipt Details</Text>
                <View style={styles.section}>
                    <Text style={styles.label}>Contract ID:</Text>
                    <Text style={styles.value}>{data.idContrato}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Receipt ID:</Text>
                    <Text style={styles.value}>{data.idRecibo}</Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Generated on:</Text>
                    <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
                </View>
            </Page>
        </Document>
    );
};

// Server Component
export default async function GeneratePDF({ data }: { data: ReceiptData }) {
    try {
        // Define the file path
        const fileName = `Recibo_${data.idContrato}_${data.idRecibo}.pdf`;
        const filePath = path.join(process.cwd(), "app", "recibos", fileName);

        // Ensure the directory exists
        await fs.mkdir(path.dirname(filePath), { recursive: true });

        // Generate the PDF
        const pdfDoc = pdf(<PDFDocument data={data} />);
        const pdfBuffer = await pdfDoc.toBuffer();

        // Save the PDF to the specified path
        await fs.writeFile(filePath, pdfBuffer);

        return { success: true, fileName };
    } catch (error) {
        console.error("Error generating PDF:", error);
        return { success: false, error: "Failed to generate PDF" };
    }
}
