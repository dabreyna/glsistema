import dbQuery from '@/lib/dbQuery';

export async function getVentasMes(id_usuario: string) {
    let query = `SELECT cast(COUNT(*) as INT) AS ventas
             FROM contratos_terrenos a
             INNER JOIN cat_usuarios b ON a.vendedor = b.id_usuario
             WHERE 
                   --EXTRACT(MONTH FROM fecha_contrato) = EXTRACT(MONTH FROM CURRENT_DATE - INTERVAL '7 months')
                    EXTRACT(MONTH FROM fecha_contrato) = EXTRACT(MONTH FROM CURRENT_DATE)
                    AND EXTRACT(YEAR FROM fecha_contrato) = EXTRACT(YEAR FROM CURRENT_DATE)
                    AND a.id_estatus_contrato IN (1, 4, 5)
                    and b.perfil_usuario in(2)
                    and b.id_usuario=${id_usuario}
            --  GROUP BY vendedor, nombre_completo;
             `;
    let tempData = await dbQuery(query);
    return { rows: tempData.rows[0].ventas };
                  
}