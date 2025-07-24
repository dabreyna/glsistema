import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");
    const chkFechaRecibo = searchParams.get("chkFechaRecibo");

    let where = " ";
    let query = "";
    if (fInicio != "" && fFin != "") {
        query = `SELECT 'Por favor ingrese un rango de fechas válidos'`;
    }
    if (chkFechaRecibo != "" && chkFechaRecibo != "false") {
        where += " and (g.fecha_recibo >='" + fInicio + "' and g.fecha_recibo <='" + fFin + " 23:59:59') "; //ESTE BUSCA POR FECHA DE RECIBO DE PAGO DE TRASPASO
    } else {
        where += " and (a.fecha >='" + fInicio + "' and a.fecha <='" + fFin + " 23:59:59') ";
    }
    query = `SELECT to_char(a.fecha,'dd/MM/yyyy') as fecha,a.comision,a.monto_comision,coalesce(a.comentarios, '- - -') AS COMENTARIOS,
            coalesce(a.folio_recibo,'') as FOLIO_RECIBO,
            F.ID_TRASPASO AS RECIBO_ID,
            (SELECT concat(nombre,' ',ap_paterno,' ',coalesce(AP_MATERNO,' ')) FROM clientes WHERE  id_cliente = a.id_cliente_anterior) AS CLIENTEANTERIOR,
            (SELECT concat(nombre , ' ' , ap_paterno,' ',coalesce(AP_MATERNO,' ')) FROM clientes WHERE  id_cliente = a.id_cliente_nuevo) AS CLIENTENUEVO,d.no_manzana AS MANZANA,
            c.no_terreno AS TERRENO,e.fraccionamiento AS FRACCIONAMIENTO,
            --(SELECT fechaRecibo from sistema_traspasos_recibos where folio=a.folio_recibo) AS FECHA_RECIBO
            to_char(g.fecha_recibo,'dd/MM/yyyy') as FECHA_RECIBO
            FROM   traspasos a
            INNER JOIN contratos_terrenos b ON a.id_contrato = b.id_contrato
            INNER JOIN cat_terrenos c ON b.id_terreno = c.id_terreno
            INNER JOIN cat_manzanas d ON c.id_manzana = d.id_manzana
            INNER JOIN cat_fraccionamientos e ON d.id_fraccionamiento = e.id_fraccionamiento 
            INNER JOIN sistema_traspasos_recibos g on a.FOLIO_recibo = g.Folio
            --inner join CLIENTES f on a.ID_CLIENTE_ANTERIOR = f.ID_CLIENTE
            left JOIN sistema_traspasos f  --SI LLEGAN A FALTAR TRASPASOS EN EL LISTADO
            ON f.FOLIO = a.FOLIO_RECIBO -- OMITIR EL LEFT JOIN, CON INNER TAMPOCO SIRVE
            --left JOIN sistema_traspasos_recibos g on f.FOLIO = g.Folio
            where c.BND_ACTIVO=true
            ${where}
            ORDER BY  g.fecha_recibo desc,FRACCIONAMIENTO ASC ,MANZANA ASC
               `;

    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
