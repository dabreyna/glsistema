import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
// import moment from "moment";

/*TODO:


*/

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");
    const mensualidades = searchParams.get("mensualidades");
    const chkDolares = searchParams.get("chkDolares");
    const chkServicio = searchParams.get("chkServicio");

    let where = " ";
    let query = "";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and aa.id_fraccionamiento=${idFraccionamiento}`;
    }

    if (chkDolares != "" && chkDolares != "false") {
        where += `  and aa.moneda=1`;
    } else {
        where += `  and aa.moneda=0`;
    }
    let mens = "";
    if (mensualidades != "0" && mensualidades != "") {
        switch (mensualidades) {
            case "1":
                {
                    where += ` and aa.mensualidades_vencidas=1`;
                    mens = ` where mensualidades_vencidas=1`;
                }
                break;
            case "2":
                {
                    where += ` and aa.mensualidades_vencidas=2`;
                    mens = ` where mensualidades_vencidas=2`;
                }
                break;
            case "3":
                {
                    where += ` and aa.mensualidades_vencidas=3`;
                    mens = ` where mensualidades_vencidas=3`;
                }
                break;
            case "4":
                {
                    where += ` and aa.mensualidades_vencidas > 3`;
                    mens = ` where mensualidades_vencidas > 3`;
                }
                break;
        }
    }

    if (fInicio != "" && fFin != "") {
        where += ` and aa.fecha_contrato_original between '${fInicio}' and '${fFin} 23:59:59'`;
    }

    if (nombreCliente) {
        const words = nombreCliente.split(" ");
        words.forEach((word) => {
            where += ` AND CONCAT(i.NOMBRE,' ',i.AP_PATERNO,' ',COALESCE(i.AP_MATERNO, '')) LIKE '%${word}%'`;
        });
    }

    if (chkServicio != "" && chkServicio != "false") {
        query = `select terreno,nombre_cliente,fecha_contrato,servicio,mes1,mes2,mes3,mes4,dia_vencimiento,mensualidades_vencidas,monto_vencido,monto_pagado from(
             select distinct ID_CLIENTE,ID_CONTRATO,Terreno,nombre_cliente,fecha_contrato,SERVICIO,mes1,mes2,mes3,mes4,dia_vencimiento,mensualidades_vencidas,
                                    coalesce(mes1,0)+coalesce(mes2,0)+coalesce(mes3,0)+coalesce(mes4,0) as monto_vencido,0 as monto_pagado
              from(
                SELECT a.ID_MOVIMIENTO_DETALLE,a.ID_TIPO_MOVIMIENTO,a.ID_SERVICIO,a.ID_CONTRATO,g.ID_CLIENTE,concat(g.NOMBRE,' ',g.AP_PATERNO,' ',coalesce(g.AP_MATERNO,'')) AS nombre_cliente,
                        concat(e.NOMENCLATURA,'-',d.NO_MANZANA,'-',c.NO_TERRENO) AS Terreno,b.FECHA_CONTRATO AS fecha_contrato_original, to_char(b.FECHA_CONTRATO,'dd/MM/yyyy') AS fecha_contrato,
                    a.FECHA_MOVIMIENTO,to_char(i.FECHA_INICIO ,'dd') as dia_vencimiento,(select count(*) from (select count(*) as meses from MOVIMIENTOS_DETALLE where BND_ACTIVO=true and ID_CONTRATO=a.ID_CONTRATO and ID_SERVICIO=a.ID_SERVICIO and ID_TIPO_MOVIMIENTO=10 and coalesce(BND_PAGADO,false)=false and FECHA_MOVIMIENTO <= now() group by to_char(FECHA_MOVIMIENTO,'yyyyMM'))iaa) as mensualidades_vencidas,
                                          h.SERVICIO,
                                          --(select coalesce(sum(coalesce(MONTO,0)),0) from MOVIMIENTOS_DETALLE where BND_ACTIVO=1 and NO_PAGO=a.ID_MOVIMIENTO_DETALLE and ID_TIPO_MOVIMIENTO=11) as monto_pagado,
                                      -- a.MONTO_SALDO,--g.EMAIL,
                                          coalesce((select sum(saldo) as mes1 from (select coalesce(monto_saldo,0) as saldo,ID_MOVIMIENTO_DETALLE from movimientos_detalle  WHERE ID_CONTRATO=a.ID_CONTRATO AND ID_TIPO_MOVIMIENTO=10 AND ID_SERVICIO=a.ID_SERVICIO AND MONTO_SALDO>0 order by ID_MOVIMIENTO_DETALLE offset 0 rows fetch next 1 rows only) as a group by ID_MOVIMIENTO_DETALLE
                                          ),0) as mes1, 
                                          coalesce((select sum(saldo) as mes2 from (select coalesce(monto_saldo,0) as saldo,ID_MOVIMIENTO_DETALLE from movimientos_detalle  WHERE ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=10 AND ID_SERVICIO=a.ID_SERVICIO AND MONTO_SALDO>0 order by ID_MOVIMIENTO_DETALLE offset 1 rows fetch next 1 rows only) as a group by ID_MOVIMIENTO_DETALLE
                                          ),0) as mes2,
                                          coalesce((select sum(saldo) as mes3 from (select coalesce(monto_saldo,0) as saldo,ID_MOVIMIENTO_DETALLE from movimientos_detalle  WHERE ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=10 AND ID_SERVICIO=a.ID_SERVICIO AND MONTO_SALDO>0 order by ID_MOVIMIENTO_DETALLE offset 2 rows fetch next 1 rows only) as a group by ID_MOVIMIENTO_DETALLE
                                          ),0) as mes3,
                                          coalesce((select sum(saldo) as mes4 from (select distinct FECHA_MOVIMIENTO,coalesce(monto_saldo,0) as saldo, ID_MOVIMIENTO_DETALLE from movimientos_detalle  WHERE ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=10 AND ID_SERVICIO=a.ID_SERVICIO AND MONTO_SALDO>0 order by ID_MOVIMIENTO_DETALLE offset 3 rows) as a --group by id_servicio
                                          ),0) as mes4
                FROM MOVIMIENTOS_DETALLE a
                  INNER JOIN CONTRATOS_TERRENOS b ON b.ID_CONTRATO = a.ID_CONTRATO
                  INNER JOIN CAT_TERRENOS c ON c.ID_TERRENO = b.ID_TERRENO
                  INNER JOIN CAT_MANZANAS d ON d.ID_MANZANA = c.ID_MANZANA
                  INNER JOIN CAT_FRACCIONAMIENTOS e ON e.ID_FRACCIONAMIENTO = d.ID_FRACCIONAMIENTO
                  INNER JOIN CAT_TIPOS_MOVIMIENTO f ON f.ID_TIPO_MOVIMIENTO=a.ID_TIPO_MOVIMIENTO
                  INNER JOIN CLIENTES g ON g.ID_CLIENTE = b.ID_CLIENTE
                  INNER JOIN CAT_SERVICIOS h ON h.ID_SERVICIO = a.ID_SERVICIO
                  INNER JOIN MOVIMIENTOS_CABECERA i on i.ID_CONTRATO=a.ID_CONTRATO
                  WHERE
                  e.ID_FRACCIONAMIENTO=${idFraccionamiento} --si se borra esta condicion se puede obtener los servicios de todos los fraccionamientos
                      AND a.ID_TIPO_MOVIMIENTO=10
                      AND a.BND_PAGADO!=true
                      AND a.BND_ACTIVO=true 
                      AND a.MONTO_SALDO is not null
                      ) as datos
                  )
                  ${mens}
              ORDER BY terreno
    `;
    } else {
        query = `select terreno,nombre_cliente,fecha_contrato,servicio,mes1,mes2,mes3,mes4,dia_vencimiento,mensualidades_vencidas,monto_vencido,monto_pagado from (
                    select coalesce(f.moneda,0) as moneda
                    ,concat(d.NOMENCLATURA,'-',c.NO_MANZANA,'-',b.NO_TERRENO) as terreno,d.id_fraccionamiento,a.fecha_contrato as fecha_contrato_original
                    ,concat(e.NOMBRE,' ',e.AP_PATERNO,' ',coalesce(e.AP_MATERNO,'')) as nombre_cliente,e.EMAIL,to_char(a.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato
                    ,a.ID_CONTRATO,'--' as servicio
                    ,(select coalesce(sum(coalesce(MONTO_SALDO,0)),0) from MOVIMIENTOS_DETALLE where BND_ACTIVO=true and ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=2 and coalesce(BND_PAGADO,false)=false and FECHA_MOVIMIENTO <= now()) as monto_vencido
                    ,(select coalesce(sum(coalesce(MONTO,0)),0) from MOVIMIENTOS_DETALLE where BND_ACTIVO=true and ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=3) as monto_pagado
                    ,coalesce((select coalesce(MONTO_SALDO,0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=2 and BND_ACTIVO=true and coalesce(BND_PAGADO,false)=false and FECHA_MOVIMIENTO<=now() order by NO_PAGO limit 1 ),0) as mes1
                    ,coalesce((select coalesce(MONTO_SALDO,0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=2 and BND_ACTIVO=true and coalesce(BND_PAGADO,false)=false and FECHA_MOVIMIENTO<=now() and NO_PAGO=(select NO_PAGO+1 from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=2 and BND_ACTIVO=true and coalesce(BND_PAGADO,false)=false order by NO_PAGO limit 1)),0) as mes2
                    ,coalesce((select coalesce(MONTO_SALDO,0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=2 and BND_ACTIVO=true and coalesce(BND_PAGADO,false)=false and FECHA_MOVIMIENTO<=now() and NO_PAGO=(select NO_PAGO+2 from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=2 and BND_ACTIVO=true and coalesce(BND_PAGADO,false)=false order by NO_PAGO limit 1)),0) as mes3
                    ,coalesce((select sum(coalesce(MONTO_SALDO,0)) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=2 and BND_ACTIVO=true and coalesce(BND_PAGADO,false)=false and FECHA_MOVIMIENTO<=now() and NO_PAGO >= (select NO_PAGO+3 from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=2 and BND_ACTIVO=true and coalesce(BND_PAGADO,false)=false order by NO_PAGO limit 1)),0) as mes4
                    ,to_char(f.FECHA_INICIO,'dd') as dia_vencimiento
                    ,(select count(*) from MOVIMIENTOS_DETALLE where BND_ACTIVO=true and ID_CONTRATO=a.ID_CONTRATO and ID_TIPO_MOVIMIENTO=2 and coalesce(BND_PAGADO,false)=false and FECHA_MOVIMIENTO <= now()) as mensualidades_vencidas
                    from CONTRATOS_TERRENOS a
                    inner join CAT_TERRENOS b on b.ID_TERRENO=a.ID_TERRENO
                    inner join CAT_MANZANAS c on c.ID_MANZANA=b.ID_MANZANA
                    inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO=c.ID_FRACCIONAMIENTO
                    inner join CLIENTES e on e.ID_CLIENTE=a.ID_CLIENTE
                    inner join MOVIMIENTOS_CABECERA f on f.ID_CONTRATO=a.ID_CONTRATO
                    where a.ID_ESTATUS_CONTRATO in (1,4,5)
                    ) aa
                    where aa.monto_vencido > 0 
                    ${where}
					          order by aa.terreno`;
    }

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
