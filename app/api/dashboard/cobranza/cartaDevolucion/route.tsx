import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const nombreCliente = searchParams.get("nombreCliente");
    const porcentajeCancelacion = 20.0;

    let where = ``;
    if (nombreCliente) {
        const words = nombreCliente.split(" ");
        words.forEach((word) => {
            where += ` AND CONCAT(a.NOMBRE,' ',a.AP_PATERNO,' ',COALESCE(a.AP_MATERNO, '')) ILIKE '%${word}%'`;
        });
    }

    const query = `select nombre_cliente,ID_CONTRATO,empresa,terreno
                  ,case when monto_devolucion <= 0 then 0 else monto_devolucion end as monto_devolucion
                  ,ESTATUS as estatus_contrato,saldo,fecha_contrato,fecha_cancelacion,precio_inicial
                  --,cargo_cancelacion
                  from (
                  select concat(a.NOMBRE,' ',a.AP_PATERNO,' ',coalesce(a.AP_MATERNO,'')) as nombre_cliente ,b.ID_CONTRATO,c.ESTATUS
                  ,concat(f.NOMENCLATURA,'-',e.NO_MANZANA,'-',d.NO_TERRENO) as terreno,g.nombre as empresa 
                  ,(h.monto_terreno_inicial)*(${porcentajeCancelacion}/100.00) as cargo_cancelacion
                  ,case when i.id_contrato is not null then i.monto_devolucion 
                    else 
                      case when b.BND_CANCELADO=true 
                        then (select coalesce(sum(monto),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=b.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=3
                            and bnd_contrato_cancelado=true)
                      else
                        (select coalesce(sum(monto),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=b.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=3
                        and bnd_contrato_cancelado=false)
                      end - ((h.monto_terreno_inicial)*(${porcentajeCancelacion}/100.00))
                  end
                  as monto_devolucion
                  ,h.SALDO as saldo,to_char(b.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato
                  ,to_char(b.FECHA_CANCELACION,'dd/MM/yyyy') as fecha_cancelacion
                  ,h.monto_terreno_inicial as precio_inicial
                  from clientes a 
                  inner join CONTRATOS_TERRENOS b on b.ID_CLIENTE=a.ID_CLIENTE 
                  inner join CAT_ESTATUS_CONTRATO c on c.ID_ESTATUS=b.ID_ESTATUS_CONTRATO 
                  inner join CAT_TERRENOS d on d.ID_TERRENO=b.ID_TERRENO 
                  inner join CAT_MANZANAS e on e.ID_MANZANA=d.ID_MANZANA 
                  inner join CAT_FRACCIONAMIENTOS f on f.ID_FRACCIONAMIENTO=e.ID_FRACCIONAMIENTO 
                  inner join cat_empresas g on g.id_empresa=f.id_empresa 
                  inner join movimientos_cabecera h on h.id_contrato=b.id_contrato
                  left join cobranza_cartas_devolucion i on i.id_contrato=b.id_contrato
                  where 1=1 ${where}
                  )aa
                  order by nombre_cliente,id_contrato
`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
