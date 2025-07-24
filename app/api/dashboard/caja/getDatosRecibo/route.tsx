import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idContrato = searchParams.get("idContrato");
    const idRecibo = searchParams.get("idRecibo");

    const query = `select a.no_recibo,a.id_contrato,f.razon_social,f.rfc,f.direccion as direccion1,f.ciudad,f.estado,f.cp,
                        f.telefono_principal, a.id_tipo_movimiento,a.monto,
                        a.fecha_movimiento,concat(g.nombre,' ',g.ap_paterno,' ',coalesce(g.ap_materno,'')) as cajero,
						concat(h.nombre,' ',h.ap_paterno,' ',coalesce(h.ap_materno,'')) as nombre_cliente,
						concat(e.nomenclatura,'-',d.no_manzana,'-',c.no_terreno) as clave_terreno,
						to_char(b.fecha_contrato,'dd/MM/yyyy') as fecha_contrato, a.monto as monto_recibo,i.saldo
                 from movimientos_detalle a
                 inner join contratos_terrenos b on a.id_contrato=b.id_contrato
                 inner join cat_terrenos c on b.id_terreno=c.id_terreno
                 inner join cat_manzanas d on c.id_manzana=d.id_manzana
                 inner join cat_fraccionamientos e on d.id_fraccionamiento=e.id_fraccionamiento
                 inner join cat_empresas f on e.id_empresa=f.id_empresa
                 inner join cat_usuarios g on a.usuario=g.id_usuario
                 inner join clientes h on b.id_cliente=h.id_cliente
				 inner join movimientos_cabecera i on a.id_contrato=i.id_contrato 
                 where a.no_recibo=${idRecibo} and a.id_contrato=${idContrato}`;
    const tempData = await dbQuery(query);
    return NextResponse.json(tempData.rows, { status: 200 });
}
