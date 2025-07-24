import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

/*TODO:


*/
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const idFraccionamiento = searchParams.get("idFraccionamiento");
  const mesAjuste = searchParams.get("mesAjuste");
  const anioAjuste = searchParams.get("anioAjuste");

  let where = "";

  if (mesAjuste != "" && mesAjuste != "0") {
    where += ` and d.mes=${mesAjuste}`;
  }

  if (anioAjuste != "" && anioAjuste != "0") {
    where += ` and d.anio=${anioAjuste}`;
  }

  if (idFraccionamiento != "" && idFraccionamiento != "0") {
    where += ` and g.id_fraccionamiento=${idFraccionamiento}`;
  }

  let query = `select xx.MES,xx.ANIO,xx.Cliente,xx.Terreno,xx.MENSUALIDAD_ANTERIOR,xx.SALDO_ANTERIOR,xx.importe_ajuste,xx.MENSUALIDAD_ACTUAL,xx.SALDO_ACTUAL,xx.MENSUALIDADES_PENDIENTES
              ,(xx.SALDO_ACTUAL-xx.SALDO_ANTERIOR) as resultado,xx.fecha_contrato
                from (
                select d.MES,d.ANIO,a.ID_CONTRATO, concat(c.NOMBRE,' ',c.AP_PATERNO,' ',coalesce(c.AP_MATERNO,'')) as Cliente
                ,concat(g.NOMENCLATURA,'-',f.NO_MANZANA,'-',e.NO_TERRENO) as Terreno,a.MENSUALIDAD_ANTERIOR,a.MENSUALIDAD_ACTUAL-a.MENSUALIDAD_ANTERIOR as importe_ajuste
                ,a.MENSUALIDAD_ACTUAL,a.MENSUALIDADES_PENDIENTES
                ,(saldo_actual-saldo_anterior) as resultado
                ,to_char(b.FECHA_CONTRATO,'dd/MM/yyyy') as fecha_contrato
                ,a.saldo_anterior,a.saldo_actual
                ,g.fraccionamiento as fraccionamiento
                from AJUSTE_ANUAL_DETALLE a
                inner join CONTRATOS_TERRENOS b on b.ID_CONTRATO=a.ID_CONTRATO
                inner join CLIENTES c on c.ID_CLIENTE=b.ID_CLIENTE
                inner join AJUSTE_ANUAL d on a.ID_AJUSTE=d.ID_AJUSTE
                inner join CAT_TERRENOS e on e.ID_TERRENO=b.ID_TERRENO
                inner join CAT_MANZANAS f on f.ID_MANZANA=e.ID_MANZANA
                inner join CAT_FRACCIONAMIENTOS g on g.ID_FRACCIONAMIENTO=f.ID_FRACCIONAMIENTO
                where 1=1 
                ${where}  
              )
              xx
              order by xx.Terreno asc`;

  console.log(query);
  if (idFraccionamiento === "0" || idFraccionamiento === "") {
    query = `SELECT 'POR FAVOR SELECCIONA UN FRACCIONAMIENTO'`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
  }

  const tempData = await dbQuery(query);

  return NextResponse.json(tempData.rows, { status: 200 });
}
