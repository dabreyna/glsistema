import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");
    const chkHistorico = searchParams.get("chkHistorico");

    let where = " ";

    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and d.id_fraccionamiento=${idFraccionamiento}`;
    }

    const query = `select d.NOMENCLATURA,c.NO_MANZANA,b.NO_TERRENO
                  ,(e.NOMBRE||' '||e.AP_PATERNO||' '||coalesce(e.AP_MATERNO,'')) as nombre_cliente,f.MONTO_TERRENO_INICIAL,f.MONTO_TERRENO_ACTUAL,b.SUPERFICIE
                  ,(select coalesce(sum(MONTO),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=2 and BND_PAGADO=true and bnd_contrato_cancelado=false) as pagado2
                  ,(select (select coalesce(sum(monto),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO in (12)  and bnd_contrato_cancelado=false) + --as depositos
                  (select coalesce(sum(monto),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO in (3) and bnd_contrato_cancelado=false)-  --as pagos
                  (select coalesce(sum(coalesce(MONTO,0)),0) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true  and bnd_contrato_cancelado=false and ID_TIPO_MOVIMIENTO in (5))) as pagado --as descuentos_mensualidad

                  ,(select sum(MONTO_SALDO) from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true and ID_TIPO_MOVIMIENTO=2  and bnd_contrato_cancelado=false and coalesce(BND_PAGADO,false)=false) saldo
                  ,to_char(a.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato,a.ID_CONTRATO
                  ,(select to_char(max(FECHA_MOVIMIENTO),'dd/MM/yyyy') from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and bnd_activo=true  
                     and bnd_contrato_cancelado=false and ID_TIPO_MOVIMIENTO=3) as ultimo_pago,
                  e.TEL_COD_CASA||'-'||e.TEL_CASA as CASA_MX, e.TEL_COD_CEL||'-'||e.TEL_CEL as CEL_MX, e.TEL_COD_TRABAJO||'-'||e.TEL_TRABAJO as TRABAJO_MX, 
                  case when e.TEL_USA_CASA=true then 'SI' else 'NO' END as TEL_USA_CASA, case when e.TEL_USA_CEL=true then 'SI' else 'NO' END  AS TEL_USA_CEL,case when e.TEL_USA_OFICINA=true then 'SI' else 'NO' END as TEL_USA_OFICINA,
                  (select b.superficie*(select precio_m2 from lista_precios where id_tipo_terreno=b.TIPO_TERRENO and id_fraccionamiento=d.ID_FRACCIONAMIENTO)as preci) as PrecioInventario 
                  from CONTRATOS_TERRENOS a
                  inner join CAT_TERRENOS b on b.ID_TERRENO=a.ID_TERRENO
                  inner join CAT_MANZANAS c on c.ID_MANZANA=b.ID_MANZANA
                  inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO=c.ID_FRACCIONAMIENTO
                  inner join CLIENTES e on e.ID_CLIENTE=a.ID_CLIENTE
                  left join MOVIMIENTOS_CABECERA f on f.ID_CONTRATO=a.ID_CONTRATO
                  --left join lista_precios g on g.idFraccionamiento =d.ID_Fraccionamiento  
                  where a.ID_ESTATUS_CONTRATO=5 
                  ${where}

                  and (
                      select max(FECHA_MOVIMIENTO)
                      from MOVIMIENTOS_DETALLE 
                      where ID_CONTRATO=a.ID_CONTRATO and bnd_activo=true  and bnd_contrato_cancelado=false and ID_TIPO_MOVIMIENTO=3) between
                      '${fInicio}' and '${fFin} 23:59:59'
                      order by ultimo_pago`;

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
