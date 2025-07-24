
export default async function dbQueryTrans(client: any, query: string, values?: any[]) { // Recibe el cliente como argumento
  try {
      const result = await client.query(query, values); 
      return { rows: result.rows };
  } catch (error) {
      console.error("Error en dbQuery:", error);
      throw error; 
  }
}