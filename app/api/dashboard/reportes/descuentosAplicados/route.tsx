import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idFraccionamiento = searchParams.get("idFraccionamiento");
    const idUsuarioActivo = searchParams.get("idUsuarioActivo");
    const tipo_descuento = searchParams.get("tipoDescuento");
    const fInicio = searchParams.get("fInicio");
    const fFin = searchParams.get("fFin");

    let where = "";
    if (idFraccionamiento != "" && idFraccionamiento != "0") {
        where += ` and d.id_fraccionamiento=${idFraccionamiento}`;
    }
    if (fInicio != "" && fInicio != "0" && fFin != "" && fFin != "0") {
        where += ` and f.fecha_movimiento between '${fInicio}' and '${fFin} 23:59:59'`;
    }
    if (idUsuarioActivo != "0") {
        where += ` and f.usuario='${idUsuarioActivo}'`;
    }
    if (tipo_descuento != "0") {
        if (tipo_descuento == "5" || tipo_descuento == "6") {
            where += ` and f.id_tipo_movimiento=${tipo_descuento}`;
        } else if (tipo_descuento == "nota") {
            where += ` and f.id_tipo_pago=5`;
        }
    }

    let query = `select ROW_NUMBER() OVER(order by a.id_cliente) as consecutivod, ROW_NUMBER() OVER(order by a.id_cliente) as consecutivo
                ,e.AP_PATERNO||' '||coalesce(e.AP_MATERNO,'')|| ' ' ||e.NOMBRE as nombre_cliente
                ,d.NOMENCLATURA||'-'||c.NO_MANZANA||'-'||b.NO_TERRENO as terreno
                ,f.NO_RECIBO as recibo,to_char(f.FECHA_MOVIMIENTO,'dd/MM/yyyy') as fecha_movimiento,
                (Select  to_char(fecha_movimiento, 'dd/MM/yyyy')   
                    from MOVIMIENTOS_DETALLE
                    where NO_PAGO =f.NO_PAGO AND ID_TIPO_MOVIMIENTO=2 and ID_CONTRATO=f.ID_CONTRATO and bnd_contrato_cancelado=false
                    )AS MensualidadCubierta

                ,f.MONTO
                ,(select case when f.ID_TIPO_MOVIMIENTO=5 then DESCUENTO_MENSUALIDAD
                              when f.ID_TIPO_MOVIMIENTO=6 then DESCUENTO_INTERES end 
                  from MOVIMIENTOS_DETALLE where ID_CONTRATO=a.ID_CONTRATO and BND_ACTIVO=true 
                  and bnd_contrato_cancelado=false and ID_TIPO_MOVIMIENTO=4 and NO_RECIBO=f.NO_RECIBO) as porcentaje
                ,case when f.ID_TIPO_PAGO=5 then 'NOTA DE CREDITO' else g.MOVIMIENTO end tipo
                ,f.JUSTIFICACION_DESCUENTO as justificacion, f.USUARIO as asesor
                ,k.NOMBRE||' '||k.AP_PATERNO||' '||coalesce(k.AP_MATERNO,'') as Ejecutivo
                from CONTRATOS_TERRENOS a
                inner join cat_terrenos b on b.ID_TERRENO=a.ID_TERRENO
                inner join CAT_MANZANAS c on c.ID_MANZANA=b.ID_MANZANA
                inner join CAT_FRACCIONAMIENTOS d on d.ID_FRACCIONAMIENTO=c.ID_FRACCIONAMIENTO
                inner join CLIENTES e on e.ID_CLIENTE=a.ID_CLIENTE
                inner join MOVIMIENTOS_DETALLE f on f.ID_CONTRATO=a.ID_CONTRATO
                inner join CAT_TIPOS_MOVIMIENTO g on g.ID_TIPO_MOVIMIENTO=f.ID_TIPO_MOVIMIENTO
                inner join cat_USUARIOS k on k.id_USUARIO=f.USUARIO
                where f.ID_TIPO_MOVIMIENTO in (5,6) 
                ${where}
                and f.BND_ACTIVO=true order by consecutivo ASC , recibo DESC`;

    const tempData = await dbQuery(query);

    return NextResponse.json(tempData.rows, { status: 200 });
}
