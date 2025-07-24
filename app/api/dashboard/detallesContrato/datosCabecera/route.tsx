import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const idCliente = searchParams.get("idCliente");
    if (!idContrato) {
        return NextResponse.json({ error: 'El parámetro "idContrato" es requerido.' }, { status: 400 });
    }
    let query = `SELECT CONCAT(A.AP_PATERNO,' ',COALESCE(A.AP_MATERNO,' '),' ',A.NOMBRE) AS NOMBRE,A.CONYUGE,CONCAT(A.TEL_COD_CASA,'-',A.TEL_CASA) AS TEL_CASA,
                  CONCAT(A.TEL_COD_CEL,'-',A.TEL_CEL) AS TEL_CEL,CONCAT(A.TEL_COD_TRABAJO,'-',A.TEL_TRABAJO) AS TEL_TRABAJO,A.EMAIL,B.ESTADO,TO_CHAR(A.FECHA_NACIMIENTO,'DD/MM/YYYY') AS FECHA_NACIMIENTO,
                  C.MEDIO,CONCAT(I.NOMBRE,' ',I.AP_PATERNO,' ',COALESCE(I.AP_MATERNO,''))AS VENDEDOR,
                  COALESCE(CONCAT(J.NOMBRE,' ',J.AP_PATERNO,' ',COALESCE(J.AP_MATERNO,'')), '--') AS VENDEDOR_COMPARTIDO,
                  D.ID_ESTATUS_CONTRATO,E.ESTATUS,D.ID_TERRENO,F.NO_TERRENO,G.ID_MANZANA,G.NO_MANZANA,G.ID_FRACCIONAMIENTO,
                  H.FRACCIONAMIENTO,H.NOMENCLATURA,TO_CHAR(D.FECHA_CONTRATO,'DD/MM/YYYY') AS FECHA_CONTRATO,
                  TO_CHAR(D.FECHA_FIRMA,'DD/MM/YYYY') AS FECHA_FIRMA,A.ID_CLIENTE,A.ID_CLIENTE,
                  CASE WHEN D.BND_CONTRATO_ENTREGADO THEN 'SI' ELSE 'NO' END AS CONTRATO_ENTREGADO
               FROM CLIENTES A
               LEFT JOIN CAT_ESTADO_CIVIL B ON A.ESTADO_CIVIL = B.ID_ESTADO
               INNER JOIN CONTRATOS_TERRENOS D ON A.ID_CLIENTE = D.ID_CLIENTE
               LEFT JOIN CAT_MEDIOS_PUBLICITARIOS C ON D.ID_MEDIO_PUBLICITARIO = C.ID_MEDIO
               INNER JOIN CAT_ESTATUS_CONTRATO E ON D.ID_ESTATUS_CONTRATO = E.ID_ESTATUS
               INNER JOIN CAT_TERRENOS F ON F.ID_TERRENO = D.ID_TERRENO
               INNER JOIN CAT_MANZANAS G ON G.ID_MANZANA = F.ID_MANZANA
               INNER JOIN CAT_FRACCIONAMIENTOS H ON H.ID_FRACCIONAMIENTO = G.ID_FRACCIONAMIENTO
               LEFT JOIN CAT_USUARIOS I ON D.VENDEDOR = I.ID_USUARIO
               LEFT JOIN CAT_USUARIOS J ON D.VENDEDOR_COMPARTIDO = I.ID_USUARIO
               WHERE D.ID_CONTRATO = ${idContrato}
                      AND A.ID_CLIENTE = ${idCliente}
             `;
    let tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
