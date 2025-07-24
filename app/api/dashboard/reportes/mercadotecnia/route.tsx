import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";



export async function GET(request: NextRequest) {
  
  const { searchParams } = new URL(request.url); 
  const idMedio = searchParams.get('idMedio');
  const idEstatus = searchParams.get('idEstatus');
  const idAsesorActivo = searchParams.get('idAsesorActivo');
  const idAsesorInactivo = searchParams.get('idAsesorInactivo');
  const fInicio = searchParams.get('fInicio');
  const fFin = searchParams.get('fFin');
  const usuario = searchParams.get('usuario');
  const perfil = searchParams.get('perfil');

  let where=" ";

    if (idMedio !="" && idMedio != "0")
    {
        where += ` and b.id_medio=${idMedio}`;
    }

    if (idEstatus !="" && idEstatus != "0")
    {
        where += ` and d.id_estatus=${idEstatus}`;
    }

    if (idAsesorActivo !="" && idAsesorActivo != "0")
    {
        where += ` and e.vendedor='${idAsesorActivo}'`;
    }

    if (idAsesorInactivo !="" && idAsesorInactivo != "0")
    {
        where += ` and e.vendedor='${idAsesorInactivo}'`;
    }
    if (perfil =="2")
    {
        where += ` and (e.vendedor=${usuario} or a.id_usuario=${usuario}) `;
    }

  let query="";
if(fInicio!="" && fFin!=""){
  query = `SELECT
                ROW_NUMBER() OVER (ORDER BY a.fecha_alta, d.estatus) AS consecutivo,
                CONCAT(a.NOMBRE, ' ', a.AP_PATERNO, ' ', COALESCE(a.AP_MATERNO, '')) AS cliente,
                case when e.ID_CONTRATO is null then (select medio from CAT_MEDIOS_PUBLICITARIOS where ID_MEDIO=a.ID_MEDIO_PUBLICITARIO) else  b.MEDIO end as medio,
                a.id_cliente,
                CASE
                    WHEN id_estatus_contrato = 1 THEN TO_CHAR(e.fecha_contrato, 'DD/MM/YYYY')
                    WHEN id_estatus_contrato IN (3, 6, 7) THEN TO_CHAR(e.fecha_cancelacion, 'DD/MM/YYYY')
                    WHEN id_estatus_contrato = 4 THEN TO_CHAR(e.fecha_firma, 'DD/MM/YYYY')
                    WHEN id_estatus_contrato = 5 THEN (SELECT TO_CHAR(MAX(fecha_movimiento), 'DD/MM/YYYY') FROM movimientos_detalle WHERE id_contrato = e.id_contrato AND id_movimiento_detalle = 2 AND bnd_activo = true)
                    WHEN e.ID_CONTRATO IS NULL THEN TO_CHAR(a.FECHA_ALTA, 'DD/MM/YYYY')
                END AS fecha_estatus,
                TO_CHAR(a.FECHA_ALTA, 'DD/MM/YYYY') AS fecha_alta,
                case when e.ID_CONTRATO is null then (select concat(NOMBRE,' ',AP_PATERNO,' ',coalesce(AP_MATERNO,'')) from cat_USUARIOS where id_USUARIO=a.ID_USUARIO) 
                else (select concat(NOMBRE,' ',AP_PATERNO,' ',coalesce(AP_MATERNO,'')) from cat_USUARIOS where id_USUARIO=e.VENDEDOR) end as asesor
                ,case when e.ID_CONTRATO is null then 'PROMOCION' else d.ESTATUS end as estatus,
                concat(coalesce(h.nomenclatura,''),'-',g.no_manzana,'-',f.no_terreno) as ubicacion,
                h.nomenclatura,
                g.no_manzana,
                f.no_terreno
            FROM CLIENTES a
            LEFT JOIN contratos_terrenos e ON e.id_cliente = a.id_cliente
            LEFT JOIN CAT_MEDIOS_PUBLICITARIOS b ON b.ID_MEDIO = e.ID_MEDIO_PUBLICITARIO
            LEFT JOIN CAT_ESTATUS_contrato d ON d.ID_ESTATUS = e.ID_ESTATUS_contrato
            LEFT JOIN cat_terrenos f ON f.id_terreno = e.id_terreno
            LEFT JOIN cat_manzanas g ON g.id_manzana = f.id_manzana
            LEFT JOIN cat_fraccionamientos h ON h.id_fraccionamiento = g.id_fraccionamiento
            WHERE a.fecha_alta between '${fInicio}' AND '${fFin} 23:59:59'
            ${where}
            ORDER BY a.fecha_alta, d.estatus;`;
            
}else{
   query = `SELECT 'NO HAY DATOS'`
}
  const tempData = await dbQuery(query);

  return NextResponse.json(tempData.rows, { status: 200 });
}
