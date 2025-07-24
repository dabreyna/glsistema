import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import moment from "moment";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const nombreCliente = searchParams.get("nombreCliente")?.toUpperCase();
    const fraccionamiento = searchParams.get("idFraccionamiento");
    const clasificacion = searchParams.get("idClasificacion");
    const fechaInicio = moment(searchParams.get("fInicio"), "DD/MM/YYYY", true);
    const fechaFin = moment(searchParams.get("fFin"), "DD/MM/YYYY", true);
    const diaPago = searchParams.get("diaPago");
    const mensMin = searchParams.get("mensualidadMinima");
    const mensMax = searchParams.get("mensualidadMaxima");
    const asesor = searchParams.get("idAsesor");
    const tipoVencimiento = searchParams.get("tipoVencimiento");
    const nuevos = searchParams.get("nuevos");
    const postventa = searchParams.get("postventa");
    let fInicio = null;
    let fFin = null;
    let query = "";
    let where = "";

    if (fechaInicio.isValid()) {
        fInicio = searchParams.get("fInicio");
    }
    if (fechaFin.isValid()) {
        fFin = searchParams.get("fFin");
    }

    if (postventa == "true") {
        if (nombreCliente) {
            const words = nombreCliente.split(" ");
            words.forEach((word) => {
                where += ` AND CONCAT(b.NOMBRE,' ',b.AP_PATERNO,' ',COALESCE(b.AP_MATERNO, '')) ILIKE '%${word}%'`;
            });
        }
        where += fraccionamiento != "0" ? ` and e.id_fraccionamiento= ${fraccionamiento}` : "";
        where += clasificacion != "0" ? ` and m.id_clasificacion=${clasificacion} ` : "";
        where += fInicio != null && fFin != null ? ` and l.FECHA_COMPROMISO between '${fInicio}' and '${fFin} 23:59:59' ` : "";
        where += diaPago != "0" ? ` and extract(day from f.FECHA_INICIO)= ${diaPago} ` : "";
        where += mensMin != "" && mensMax != "" ? ` and z.meses_vencidos between ${mensMin} and ${mensMax} ` : "";
        where += asesor != "0" ? ` and i.id_usuario=${asesor} ` : "";

        query = `select 
            a.ID_CONTRATO,concat(e.NOMENCLATURA,'-',d.NO_MANZANA,'-',c.NO_TERRENO) as TERRENO,CONCAT(b.NOMBRE,' ',b.AP_PATERNO,' ',COALESCE(b.AP_MATERNO,'')) as NOMBRE,
            B.ID_CLIENTE
            ,TO_CHAR(f.FECHA_INICIO,'dd') as DIA_VENCIMIENTO
            ,Z.meses_vencidos AS MENSUALIDADES_VENCIDAS,z.monto_vencido as MONTO_VENCIDO
            ,CONCAT(i.NOMBRE,' ',i.AP_PATERNO,' ',COALESCE(i.AP_MATERNO,'')) as NOMBRE_ASESOR

            ,(SELECT 'SERVICIO') AS TIPO_VENCIMIENTO,(SELECT '2') AS ID_TIPO_VENCIMIENTO
            ,COALESCE(l.MONTO,0) as COMPROMISO_PAGO
            ,TO_CHAR(l.FECHA_COMPROMISO,'dd/MM/yyyy') as FECHA_COMPROMISO
            ,m.CLASIFICACION
            
            ,CASE when COALESCE(z.monto_vencido,0) <= 0 then 'VERDE_PALOMA'
                when (select TO_CHAR(max(fecha_compromiso),'dd/MM/yyyy') from agenda_cobranza where ID_contrato = a.id_contrato) < to_char(now(),'dd/MM/yyyy') then 'ROJO' 
                when (select TO_CHAR(max(fecha_compromiso),'dd/MM/yyyy') from agenda_cobranza where ID_contrato = A.ID_CONTRATO) >= to_char(now(),'dd/MM/yyyy') then 'VERDE'
                WHEN a.BND_CANCELADO=TRUE THEN 'VERDE_PALOMA'
            ELSE 'AMARILLO'
            END AS SEMAFORO
            ,(SELECT '0') AS CLIENTE_NUEVO
        
        from CONTRATOS_TERRENOS a
        left join CLIENTES b on b.ID_CLIENTE=a.ID_CLIENTE
        left join CAT_TERRENOS c on c.ID_TERRENO=a.ID_TERRENO
        left join CAT_MANZANAS d on d.ID_MANZANA=c.ID_MANZANA
        left join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO=d.ID_FRACCIONAMIENTO
        left join MOVIMIENTOS_CABECERA f on f.ID_CONTRATO=a.ID_CONTRATO
        left join (
                select ID_CONTRATO,max(FECHA_ALTA) as fecha_alta
                from AGENDA_COBRANZA 
                group by ID_CONTRATO
                ) g on g.ID_CONTRATO=a.ID_CONTRATO
        left join (select comentario,id_contrato,fecha_alta,id_clasificacion,id_tipo_comentario 
                from AGENDA_COBRANZA 
                limit 1
                --group by comentario,id_contrato,fecha_alta,id_clasificacion,id_tipo_comentario
                ) h 
                on h.ID_CONTRATO=a.ID_CONTRATO and h.FECHA_ALTA=g.fecha_alta
            
            left join cat_USUARIOS i on i.id_USUARIO=b.id_ASESOR_COBRANZA
            --inner join USUARIOS j on j.USUARIO=a.VENDEDOR
            left join CAT_COBRANZA_CLASIFICACION m on m.ID_CLASIFICACION=h.ID_CLASIFICACION
            left join COBRANZA_COMPROMISOS_PAGO l on l.ID_CONTRATO=a.ID_CONTRATO and l.BND_ACTIVO=TRUE
            left join (
            select count(*) as meses_vencidos,sum(COALESCE(MONTO_SALDO,0)) as monto_vencido,ID_CONTRATO
                                    from MOVIMIENTOS_DETALLE 
                                    where ID_TIPO_MOVIMIENTO=10
                                    and COALESCE(BND_PAGADO,FALSE)=FALSE 
                                    and FECHA_MOVIMIENTO<=NOW()
                                    group by ID_CONTRATO 
                                    ) z on z.id_contrato=a.id_contrato

            where a.ID_ESTATUS_CONTRATO=5
            AND z.meses_vencidos>0 
         ${where} `;
    } else {
        const bndNuevo = nuevos == "true" ? ` and b.ID_ESTATUS_CONTRATO in (1,4) ` : "";

        if (nombreCliente) {
            const words = nombreCliente.split(" ");
            words.forEach((word) => {
                where += ` AND CONCAT(f.NOMBRE,' ',f.AP_PATERNO,' ',COALESCE(f.AP_MATERNO, '')) ILIKE '%${word}%'`;
            });
        }

        where += fraccionamiento != "0" ? ` and e.id_fraccionamiento= ${fraccionamiento}` : "";
        where += clasificacion != "0" ? ` and n.id_clasificacion=${clasificacion} ` : "";
        where += fInicio != null && fFin != null ? ` and m.FECHA_COMPROMISO between '${fInicio}' and '${fFin} 23:59:59' ` : "";
        where += diaPago != "0" ? ` and extract(day from g.FECHA_INICIO)= ${diaPago} ` : "";
        where += mensMin != "" && mensMax != "" ? ` and h.meses_vencidos between ${mensMin} and ${mensMax} ` : "";
        where += asesor != "0" ? ` and k.id_usuario=${asesor} ` : "";
        where += tipoVencimiento != "0" ? ` and a.id_tipo_vencimiento=${tipoVencimiento} ` : "";

        const dia_primero_mes = moment().startOf("month").format("YYYY-MM-DD");
        const dia_hoy = moment().format("YYYY-MM-DD");

        if (dia_hoy == dia_primero_mes) {
            where += ` and extract(month from fecha_carga)=extract(month from NOW() - interval '1 month') and extract(year from fecha_carga)=extract(year from NOW() - interval '1 month')`;
        } else {
            where += ` and extract(month from fecha_carga)=extract( month from NOW()) and extract(year from fecha_carga)=extract(year from NOW())`;
        }

        query = `select * from ( select a.id_contrato,concat(e.nomenclatura,'-',d.NO_MANZANA,'-',c.NO_TERRENO) as terreno
        ,CONCAT(f.NOMBRE,' ',f.AP_PATERNO,' ',COALESCE(f.AP_MATERNO,'')) as nombre,b.id_cliente

        --,to_char(g.FECHA_INICIO,'dd') as dia_vencimiento
        ,extract(day from g.fecha_inicio) as dia_vencimiento
        ,h.meses_vencidos as mensualidades_vencidas,COALESCE(h.monto_vencido,0.00) as monto_vencido
        

        ,CONCAT(k.NOMBRE,' ',k.AP_PATERNO,' ',COALESCE(k.AP_MATERNO,'')) as nombre_asesor
        ,l.VENCIMIENTO as tipo_vencimiento,l.id_tipo_vencimiento,coalesce(m.MONTO,0) as compromiso_pago,to_char(m.FECHA_COMPROMISO,'dd/MM/yyyy') as fecha_compromiso
        --,(select id_clasificacion from agenda_cobranza where id_contrato=a.id_contrato and fecha_alta is not null order by fecha_alta desc limit 1) as clasificacion
        ,(select clasificacion from agenda_cobranza ac 
		  inner join CAT_COBRANZA_CLASIFICACION cc on ac.ID_CLASIFICACION=cc.ID_CLASIFICACION
		  where id_contrato=a.id_contrato and fecha_alta is not null order by fecha_alta desc limit 1) as clasificacion
        --,n.CLASIFICACION
        --,o.NOMBRE+' '+o.AP_PATERNO+' '+o.AP_MATERNO as nombre_vendedor
        
        ,CASE when coalesce(h.monto_vencido,0) <= 0 then 'VERDE_PALOMA'
            when (select max(fecha_compromiso) from agenda_cobranza where ID_contrato = a.id_contrato) < now() then 'ROJO' 
            when (select max(fecha_compromiso) from agenda_cobranza where ID_contrato = A.ID_CONTRATO) >=now()then 'VERDE'
            WHEN B.BND_CANCELADO=true THEN 'VERDE_PALOMA'
            else 'AMARILLO'
        END AS SEMAFORO,
        CASE WHEN
            (select count(no_pago) from MOVIMIENTOS_DETALLE where ID_TIPO_MOVIMIENTO=2 and ID_CONTRATO=b.ID_CONTRATO and BND_PAGADO=true and MONTO_SALDO=0 and bnd_contrato_cancelado=false) >= 6 
        THEN 0 
        ELSE 1 
        END AS cliente_nuevo

        from CARGA_CLIENTES_COBRANZA a
        inner join CONTRATOS_TERRENOS b on a.ID_CONTRATO=b.ID_CONTRATO ${bndNuevo} 
        inner join CAT_TERRENOS c on c.ID_TERRENO=b.ID_TERRENO
        inner join CAT_MANZANAS d on d.ID_MANZANA=c.ID_MANZANA
        inner join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO=d.ID_FRACCIONAMIENTO
        inner join CLIENTES f on f.ID_CLIENTE=b.ID_CLIENTE
        inner join MOVIMIENTOS_CABECERA g on g.ID_CONTRATO=b.ID_CONTRATO
        left join (
                    select count(*) as meses_vencidos,sum(COALESCE(MONTO_SALDO,0)) as monto_vencido,ID_CONTRATO
                    from MOVIMIENTOS_DETALLE 
                    where ID_TIPO_MOVIMIENTO=2 
                    and COALESCE(BND_PAGADO,FALSE)=FALSE 
                    and FECHA_MOVIMIENTO<=NOW()
                    and bnd_contrato_cancelado=false
                    group by ID_CONTRATO
                    ) h on h.ID_CONTRATO=a.ID_CONTRATO
        left join (
                    select ID_CONTRATO,max(FECHA_ALTA) as fecha_alta
                    from AGENDA_COBRANZA 
                    group by ID_CONTRATO
                ) i on i.ID_CONTRATO=a.ID_CONTRATO
        
        --left join (select comentario,id_contrato,fecha_alta,id_clasificacion from AGENDA_COBRANZA group by comentario,id_contrato,fecha_alta,id_clasificacion) j on j.ID_CONTRATO=a.ID_CONTRATO and j.FECHA_ALTA=i.fecha_alta
        --left join (select comentario,id_contrato,fecha_alta,id_clasificacion from AGENDA_COBRANZA limit 1) j on j.ID_CONTRATO=a.ID_CONTRATO and j.FECHA_ALTA=i.fecha_alta
        inner join CAT_USUARIOS k on k.ID_USUARIO=f.ID_ASESOR_COBRANZA
        inner join CAT_TIPO_VENCIMIENTO l on l.ID_TIPO_VENCIMIENTO=a.ID_TIPO_VENCIMIENTO
        left join COBRANZA_COMPROMISOS_PAGO m on m.ID_CONTRATO=a.ID_CONTRATO and m.BND_ACTIVO=TRUE
        --left join CAT_COBRANZA_CLASIFICACION n on n.ID_CLASIFICACION=j.ID_CLASIFICACION
        --inner join USUARIOS o on o.USUARIO=b.VENDEDOR
        
        where 1=1
        and a.id_tipo_vencimiento=1 
        ${where} union
    

       select a.id_contrato,concat(e.nomenclatura,'-',d.NO_MANZANA,'-',c.NO_TERRENO) as terreno
        ,CONCAT(f.NOMBRE,' ',f.AP_PATERNO,' ',COALESCE(f.AP_MATERNO,'')) as nombre,b.id_cliente
        
        --,to_char(g.FECHA_INICIO,'dd') as dia_vencimiento
        ,extract(day from g.fecha_inicio) as dia_vencimiento
        ,h.meses_vencidos as mensualidades_vencidas,COALESCE(h.monto_vencido,0.00) as monto_vencido
        --,j.COMENTARIO as ult_comentario
        ,CONCAT(k.NOMBRE,' ',k.AP_PATERNO,' ',COALESCE(k.AP_MATERNO,'')) as nombre_asesor
        ,l.VENCIMIENTO as tipo_vencimiento,l.id_tipo_vencimiento,coalesce(m.MONTO,0) as compromiso_pago,to_char(m.FECHA_COMPROMISO,'dd/MM/yyyy') as fecha_compromiso
        --,(select id_clasificacion from agenda_cobranza where id_contrato=a.id_contrato and fecha_alta is not null order by fecha_alta desc limit 1) as clasificacion
        ,(select clasificacion from agenda_cobranza ac 
		  inner join CAT_COBRANZA_CLASIFICACION cc on ac.ID_CLASIFICACION=cc.ID_CLASIFICACION
		  where id_contrato=a.id_contrato and fecha_alta is not null order by fecha_alta desc limit 1) as clasificacion
        --,n.CLASIFICACION
        --,o.NOMBRE+' '+o.AP_PATERNO+' '+o.AP_MATERNO as nombre_vendedor
        
        ,CASE when coalesce(h.monto_vencido,0) <= 0 then 'VERDE_PALOMA'
            when (select max(fecha_compromiso) from agenda_cobranza where ID_contrato = a.id_contrato) < now() then 'ROJO' 
            when (select max(fecha_compromiso) from agenda_cobranza where ID_contrato = A.ID_CONTRATO) >=now()then 'VERDE'
            WHEN B.BND_CANCELADO=true THEN 'VERDE_PALOMA'
            else 'AMARILLO'
        END AS SEMAFORO,
        CASE WHEN
            (select count(no_pago) from MOVIMIENTOS_DETALLE where ID_TIPO_MOVIMIENTO=2 and ID_CONTRATO=b.ID_CONTRATO and BND_PAGADO=true and MONTO_SALDO=0 and bnd_contrato_cancelado=false) >= 6 
        THEN 0 
        ELSE 1 
        END AS cliente_nuevo

        from CARGA_CLIENTES_COBRANZA a
        inner join CONTRATOS_TERRENOS b on a.ID_CONTRATO=b.ID_CONTRATO ${bndNuevo} 
        inner join CAT_TERRENOS c on c.ID_TERRENO=b.ID_TERRENO
        inner join CAT_MANZANAS d on d.ID_MANZANA=c.ID_MANZANA
        inner join CAT_FRACCIONAMIENTOS e on e.ID_FRACCIONAMIENTO=d.ID_FRACCIONAMIENTO
        inner join CLIENTES f on f.ID_CLIENTE=b.ID_CLIENTE
        inner join MOVIMIENTOS_CABECERA g on g.ID_CONTRATO=b.ID_CONTRATO
        left join (
                    select count(*) as meses_vencidos,sum(COALESCE(MONTO_SALDO,0)) as monto_vencido,ID_CONTRATO
                    from MOVIMIENTOS_DETALLE 
                    where ID_TIPO_MOVIMIENTO=10 
                    and COALESCE(BND_PAGADO,FALSE)=FALSE 
                    and FECHA_MOVIMIENTO<=NOW()
                    and bnd_contrato_cancelado=false
                    group by ID_CONTRATO
                    ) h on h.ID_CONTRATO=a.ID_CONTRATO
        left join (
                    select ID_CONTRATO,max(FECHA_ALTA) as fecha_alta
                    from AGENDA_COBRANZA 
                    group by ID_CONTRATO
                ) i on i.ID_CONTRATO=a.ID_CONTRATO
        --left join (select id_contrato,fecha_alta,id_clasificacion from AGENDA_COBRANZA group by id_contrato,fecha_alta,id_clasificacion) j on j.ID_CONTRATO=a.ID_CONTRATO and j.FECHA_ALTA=i.fecha_alta
        --left join (select id_contrato,fecha_alta,id_clasificacion from AGENDA_COBRANZA limit 1) j on j.ID_CONTRATO=a.ID_CONTRATO and j.FECHA_ALTA=i.fecha_alta
        inner join CAT_USUARIOS k on k.ID_USUARIO=f.ID_ASESOR_COBRANZA
        inner join CAT_TIPO_VENCIMIENTO l on l.ID_TIPO_VENCIMIENTO=a.ID_TIPO_VENCIMIENTO
        left join COBRANZA_COMPROMISOS_PAGO m on m.ID_CONTRATO=a.ID_CONTRATO and m.BND_ACTIVO=TRUE
        --left join CAT_COBRANZA_CLASIFICACION n on n.ID_CLASIFICACION=j.ID_CLASIFICACION
        --inner join USUARIOS o on o.USUARIO=b.VENDEDOR
        
        where 1=1
        and a.id_tipo_vencimiento=2

        ${where} )a `;

        const nuevo = nuevos == "true" ? " where a.cliente_nuevo=1 " : "";
        query += nuevo;
    }

    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
