import { NextRequest, NextResponse } from "next/server";
import dbQuery from "@/lib/dbQuery";
import _ from "lodash";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const idUsuario = searchParams.get("idUsuario");
    const perfil = searchParams.get("perfil");
    const fecha_inicio = searchParams.get("fInicio");
    const fecha_fin = searchParams.get("fFin");

    async function getComisiones(usuario: string | null) {
        const query = `SELECT A.ASESOR_PRIMARIO AS ASESOR,CONCAT(E.NOMENCLATURA,'-',D.NO_MANZANA,'-',C.NO_TERRENO) AS TERRENO,TO_CHAR(B.FECHA_CONTRATO,'DD/MM/YYYY') AS FECHA_CONTRATO
                    ,TO_CHAR(G.FECHA_MOVIMIENTO,'DD/MM/YYYY') AS FECHA_PAGO
                    ,CONCAT(F.NOMBRE,' ',F.AP_PATERNO,' ',COALESCE(F.AP_MATERNO,'')) AS NOMBRE_CLIENTE
                    ,CASE WHEN B.ID_ESTATUS_CONTRATO IN (3,6,7) THEN 'CANCELADO' ELSE 'ACTIVO' END AS CANCELADO
                    ,A.NO_COMISION,A.MONTO_PRIMARIO,B.ID_CONTRATO
                    ,(SELECT MAX(NO_COMISION) FROM COMISIONES WHERE ID_CONTRATO=B.ID_CONTRATO) AS MAX_COMISION,
                            CASE 
                                WHEN 
                                    A.ASESOR_PRIMARIO=${usuario} THEN TO_CHAR(A.FECHA_PAGO_PRIMARIO,'DD/MM/YYYY')
                                    ELSE NULL -- NO PAGADA
                                END  
                                AS COMISIONPAGADA
                    FROM COMISIONES A
                    INNER JOIN CONTRATOS_TERRENOS B ON B.ID_CONTRATO=A.ID_CONTRATO
                    INNER JOIN CAT_TERRENOS C ON C.ID_TERRENO=B.ID_TERRENO
                    INNER JOIN CAT_MANZANAS D ON D.ID_MANZANA=C.ID_MANZANA
                    INNER JOIN CAT_FRACCIONAMIENTOS E ON E.ID_FRACCIONAMIENTO=D.ID_FRACCIONAMIENTO
                    INNER JOIN CLIENTES F ON F.ID_CLIENTE=B.ID_CLIENTE
                    INNER JOIN (SELECT MAX(FECHA_MOVIMIENTO) AS FECHA_MOVIMIENTO,ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO FROM MOVIMIENTOS_DETALLE WHERE ID_TIPO_MOVIMIENTO=3 GROUP BY ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO
                                    --UNION ALL
                                    --SELECT MAX(FECHA_MOVIMIENTO) AS FECHA_MOVIMIENTO,ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO FROM MOVIMIENTOS_DETALLE_CANCELADOS WHERE ID_TIPO_MOVIMIENTO=3 GROUP BY ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO
                                    ) G ON G.ID_CONTRATO=A.ID_CONTRATO AND G.NO_PAGO=A.NO_COMISION AND G.ID_TIPO_MOVIMIENTO=3
                    WHERE A.BND_CONTRATO_FIRMADO=TRUE AND BND_MENSUALIDAD_PAGADA=TRUE 
                        AND A.ASESOR_PRIMARIO=${usuario}
                        AND A.BND_ACTIVO=TRUE
                        AND G.FECHA_MOVIMIENTO BETWEEN '${fecha_inicio}' AND '${fecha_fin}  23:59:59'
                        AND COALESCE(BND_BLOQUEO, FALSE) = FALSE

                    UNION ALL

                    SELECT A.ASESOR_SECUNDARIO AS ASESOR,CONCAT(E.NOMENCLATURA,'-',D.NO_MANZANA,'-',C.NO_TERRENO) AS TERRENO,TO_CHAR(B.FECHA_CONTRATO,'DD/MM/YYYY') AS FECHA_CONTRATO
                    ,TO_CHAR(G.FECHA_MOVIMIENTO,'DD/MM/YYYY') AS FECHA_PAGO
                    ,CONCAT(F.NOMBRE,' ',F.AP_PATERNO,' ',COALESCE(F.AP_MATERNO,'')) AS NOMBRE_CLIENTE
                    ,CASE WHEN B.ID_ESTATUS_CONTRATO IN (3,6,7) THEN 'CANCELADO' ELSE 'ACTIVO' END AS CANCELADO
                    ,A.NO_COMISION,A.MONTO_SECUNDARIO,B.ID_CONTRATO
                    ,(SELECT MAX(NO_COMISION) FROM COMISIONES WHERE ID_CONTRATO=B.ID_CONTRATO) AS MAX_COMISION,
                            CASE 
                                WHEN 
                                    A.ASESOR_SECUNDARIO=${usuario} THEN TO_CHAR(A.FECHA_PAGO_PRIMARIO,'DD/MM/YYYY')
                                    ELSE NULL --NO PAGADA
                                END  
                                AS COMISIONPAGADA
                    FROM COMISIONES A
                    INNER JOIN CONTRATOS_TERRENOS B ON B.ID_CONTRATO=A.ID_CONTRATO
                    INNER JOIN CAT_TERRENOS C ON C.ID_TERRENO=B.ID_TERRENO
                    INNER JOIN CAT_MANZANAS D ON D.ID_MANZANA=C.ID_MANZANA
                    INNER JOIN CAT_FRACCIONAMIENTOS E ON E.ID_FRACCIONAMIENTO=D.ID_FRACCIONAMIENTO
                    INNER JOIN CLIENTES F ON F.ID_CLIENTE=B.ID_CLIENTE
                    INNER JOIN (SELECT MAX(FECHA_MOVIMIENTO) AS FECHA_MOVIMIENTO,ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO FROM MOVIMIENTOS_DETALLE WHERE ID_TIPO_MOVIMIENTO=3 GROUP BY ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO
                                    --UNION ALL
                                    --SELECT MAX(FECHA_MOVIMIENTO) AS FECHA_MOVIMIENTO,ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO FROM MOVIMIENTOS_DETALLE_CANCELADOS WHERE ID_TIPO_MOVIMIENTO=3 GROUP BY ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO
                                    ) G ON G.ID_CONTRATO=A.ID_CONTRATO AND G.NO_PAGO=A.NO_COMISION AND G.ID_TIPO_MOVIMIENTO=3
                    WHERE A.BND_CONTRATO_FIRMADO=TRUE AND BND_MENSUALIDAD_PAGADA=TRUE 	  
                        AND A.ASESOR_SECUNDARIO=${usuario}
                        AND A.BND_ACTIVO=TRUE
                        AND G.FECHA_MOVIMIENTO BETWEEN '${fecha_inicio}' AND '${fecha_fin}  23:59:59'
                        AND COALESCE(BND_BLOQUEO, FALSE) = FALSE
                    ORDER BY TERRENO
                    --ORDER BY NOMENCLATURA,NO_MANZANA,NO_TERRENO,NO_COMISION
                `;
        const c = await dbQuery(query);
        return c;
    }

    if (perfil === "11") {
        const tempData = await getComisiones(idUsuario);

        // Agrupando los datos por manzana usando Lodash
        const groupedData = _.groupBy(tempData.rows, "asesor");

        // Transformando los datos agrupados al formato deseado
        const formattedData = Object.keys(groupedData).map((asesor) => ({
            asesor,
            comisiones: groupedData[asesor],
        }));
        return NextResponse.json(formattedData, { status: 200 });
    } else {
        const query = `SELECT USUARIO
                        FROM (SELECT A.ASESOR_PRIMARIO AS USUARIO
                            FROM COMISIONES A
                            INNER JOIN (SELECT MAX(FECHA_MOVIMIENTO) AS FECHA_MOVIMIENTO,ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO FROM MOVIMIENTOS_DETALLE WHERE ID_TIPO_MOVIMIENTO=3 GROUP BY ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO
                                        ) B ON B.ID_CONTRATO=A.ID_CONTRATO AND B.NO_PAGO=A.NO_COMISION AND B.ID_TIPO_MOVIMIENTO=3
                            INNER JOIN CAT_USUARIOS C ON C.ID_USUARIO=A.ASESOR_PRIMARIO
                            INNER JOIN CONTRATOS_TERRENOS D ON D.ID_CONTRATO=A.ID_CONTRATO
                            WHERE A.BND_ACTIVO=TRUE
                            AND A.BND_MENSUALIDAD_PAGADA=TRUE
                            AND A.BND_CONTRATO_FIRMADO=TRUE
                            AND COALESCE(BND_BLOQUEO, FALSE) = FALSE
                            AND B.FECHA_MOVIMIENTO BETWEEN '${fecha_inicio}' AND '${fecha_fin} 23:59.59'
                            UNION ALL
                            SELECT A.ASESOR_SECUNDARIO AS USUARIO
                            FROM COMISIONES A
                            INNER JOIN (SELECT MAX(FECHA_MOVIMIENTO) AS FECHA_MOVIMIENTO,ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO FROM MOVIMIENTOS_DETALLE WHERE ID_TIPO_MOVIMIENTO=3 GROUP BY ID_TIPO_MOVIMIENTO,ID_CONTRATO,NO_PAGO			
                                        ) B ON B.ID_CONTRATO=A.ID_CONTRATO AND B.NO_PAGO=A.NO_COMISION AND B.ID_TIPO_MOVIMIENTO=3
                            INNER JOIN CAT_USUARIOS C ON C.ID_USUARIO=A.ASESOR_SECUNDARIO
                            INNER JOIN CONTRATOS_TERRENOS D ON D.ID_CONTRATO=A.ID_CONTRATO
                            WHERE A.BND_ACTIVO=TRUE
                            AND A.BND_MENSUALIDAD_PAGADA=TRUE
                            AND A.BND_CONTRATO_FIRMADO=TRUE
                            AND COALESCE(BND_BLOQUEO, FALSE) = FALSE
                            AND B.FECHA_MOVIMIENTO BETWEEN '${fecha_inicio}' AND '${fecha_fin} 23:59.59'
                        )AA WHERE 1=1 
                        GROUP BY USUARIO
        `;
        const usuarios = await dbQuery(query);
        let resultados: any = [];

        for (const usuario of usuarios.rows) {
            const comisiones = await getComisiones(usuario.usuario);
            resultados.push(comisiones.rows);
        }

        const resultadosAgrupadosPorAsesor = _.groupBy(resultados.flat(), "asesor");
        const formattedData = Object.keys(resultadosAgrupadosPorAsesor).map((asesor) => ({
            asesor,
            comisiones: resultadosAgrupadosPorAsesor[asesor],
        }));

        return NextResponse.json(formattedData, { status: 200 });
    }
}
