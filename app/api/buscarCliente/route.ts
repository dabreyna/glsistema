import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import { db } from "@/lib/db";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);   

  const nombre = searchParams.get('nombre');
  if (!nombre) {
    return NextResponse.json({ error: 'El parámetro "nombre" es requerido.' }, { status: 400 });
  }
  const tokens = nombre.split(' ');
  let where="";

  tokens.forEach((token)=>{ 
    where += ` and concat(nombre,' ',ap_paterno,' ',coalesce(ap_materno,'')) ilike '%${token}%' `;
  });

  let query=`select a.id_cliente, CONCAT(ap_paterno,' ',coalesce(ap_materno,' '), ' ',nombre) as nombre_cliente,a.ap_paterno
             from clientes a
             inner join CONTRATOS_TERRENOS b on a.ID_CLIENTE = b.ID_CLIENTE and b.BND_ACTIVO=true
             inner join CAT_TERRENOS c on b.ID_TERRENO = c.ID_TERRENO
             inner join CAT_MANZANAS d on c.ID_MANZANA = d.ID_MANZANA
             inner join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO = d.ID_FRACCIONAMIENTO 
			       WHERE coalesce(b.bnd_cancelado,false)= false AND b.id_estatus_contrato IN (1,4,5)
             ${where}
             group by a.id_cliente,nombre_cliente,a.ap_paterno
             order by a.ap_paterno`;
  let tempData= await dbQuery(query);
  let query2;
  
  const Resultados = await Promise.all(tempData.rows.map(async (row:any) => {  
     query2 = await dbQuery(`select concat('Fraccionamiento: ',d.FRACCIONAMIENTO,' Manzana: ',c.NO_MANZANA,' Terreno: ',a.no_terreno,' Estatus: ',e.estatus) as Terreno,
                                  b.id_contrato,b.id_estatus_contrato as estatus_contrato 
                                  -- a.no_terreno,a.id_terreno ,c.NO_MANZANA,d.FRACCIONAMIENTO,b.id_contrato,e.estatus
                                  from cat_terrenos a
                                  inner join CONTRATOS_TERRENOS b on a.ID_TERRENO = b.ID_TERRENO and b.BND_ACTIVO = true
                                  inner join CAT_MANZANAS c on a.ID_MANZANA = c.ID_MANZANA
                                  inner join CAT_FRACCIONAMIENTOS d on c.ID_FRACCIONAMIENTO = d.ID_FRACCIONAMIENTO
                                  inner join cat_estatus_contrato e on e.id_estatus=b.id_estatus_contrato
                                  where coalesce(b.bnd_cancelado,false)=false and b.id_estatus_contrato in (1,4,5) and b.ID_CLIENTE = ${row.id_cliente}`);
      return{...row, contratos:query2.rows};})); 
    db.$disconnect();      
  return NextResponse.json(Resultados,{status:200});
}