import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import moment from "moment";

Font.register({
    family: "Arial",
    src: "public/fonts/arial.ttf",
    fontStyle: "normal",
    fontWeight: "normal",
});

const styles = StyleSheet.create({
    page: {
        flexDirection: "row",
        backgroundColor: "white",
        width: 850,
        height: 750,
        marginTop: 20,
        marginBottom: 0,
        marginLeft: 14,
        marginRight: 10,
        fontFamily: "Arial",
        fontSize: 9,
    },
    text: {
        fontSize: 9,
    },
    section: {
        padding: 10,
    },
    title: {
        fontSize: 14,
        marginBottom: 10,
    },
});

interface ReciboEstructuraProps {
    infoRecibo: {
        idRecibo: number;
        idContrato: number;
    };
}

const ReciboPDF: React.FC<ReciboEstructuraProps> = ({ infoRecibo }) => (
    <Document>
        <Page size={[850, 750]} style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Recibo de Pago</Text>
                <Text style={styles.text}>Fecha: {moment(new Date()).format("DD/MM/YYYY")}</Text>
                <Text style={styles.text}>Total: $8,323.22</Text>

                <View style={{ marginTop: 15 }}>
                    MAS DATOS DEL RECIBO
                    <Text style={styles.text}>
                        - idRecibo: {infoRecibo.idRecibo}
                        <br />- idContrato: {infoRecibo.idContrato}
                    </Text>
                </View>
            </View>
        </Page>
    </Document>
);

export default ReciboPDF;
