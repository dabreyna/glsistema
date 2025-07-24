import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idEmpresa = searchParams.get("idEmpresa");
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");

    let where = "";
    if (idEmpresa != "" && idEmpresa != "0") {
        where += ` and h.id_empresa=${idEmpresa}`;
    }
    if (fInicio != "" && fInicio != "0" && fFin != "" && fFin != "0") {
        where += ` and b.fecha_cancelacion between '${fInicio}' and '${fFin} 23:59:59'`;
    }

    let query = `select a.NOMBRE||' '||a.AP_PATERNO||' '||coalesce(a.AP_MATERNO,'') as nombre_cliente,b.ID_CONTRATO
                ,e.NOMENCLATURA||'-'||d.NO_MANZANA||'-'||c.NO_TERRENO as terreno,f.MONTO_DEVOLUCION
                ,to_char(g.FECHA_PAGO,'dd/MM/yyyy') as fecha_pago,g.NO_PAGO,g.MONTO,to_char(b.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato
                ,to_char(b.FECHA_CANCELACION,'dd/MM/yyyy') as fecha_cancelacion,h.razon_social
                ,f.MONTO_DEVOLUCION-(
                              select sum(monto) 
                              from COBRANZA_CARTAS_PAGOS 
                              where ID_CONTRATO=b.ID_CONTRATO and NO_PAGO<=g.NO_PAGO) as saldo
                from CLIENTES a
                inner join CONTRATOS_TERRENOS b on b.ID_CLIENTE=a.ID_CLIENTE
                inner join CAT_TERRENOS c on c.ID_TERRENO=b.ID_TERRENO
                inner join CAT_MANZANAS d on d.ID_MANZANA=c.ID_MANZANA
                inner join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO=d.ID_FRACCIONAMIENTO
                inner join cat_empresas h on h.id_empresa=e.id_empresa
                inner join COBRANZA_CARTAS_DEVOLUCION f on f.ID_CONTRATO=b.ID_CONTRATO
                inner join COBRANZA_CARTAS_PAGOS g on g.ID_CONTRATO=b.ID_CONTRATO
                where 1=1 
                ${where}
                order by h.razon_social,nombre_cliente,b.ID_CONTRATO,g.NO_PAGO`;

    const tempData = await dbQuery(query);
    const groupedData = _.groupBy(tempData.rows, "razon_social");
    const formattedData = Object.keys(groupedData).map((razon_social) => ({
        razon_social,
        devoluciones: groupedData[razon_social],
    }));
    return NextResponse.json(formattedData, { status: 200 });
}
