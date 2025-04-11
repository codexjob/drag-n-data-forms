
import { FormElement, FormElementType, formElementTypeToPostgresType } from "@/lib/formElementTypes";
import { DatabaseType } from "@/lib/dbConnectionTypes";

// Types SQL équivalents pour chaque type de base de données
interface SqlTypeMap {
  postgresql: string;
  mysql: string;
  mssql: string;
}

// Mapping des types de champs de formulaire vers des types SQL pour différentes bases de données
const sqlTypeMappings: Record<FormElementType, SqlTypeMap> = {
  [FormElementType.TEXT]: {
    postgresql: 'VARCHAR(255)',
    mysql: 'VARCHAR(255)',
    mssql: 'NVARCHAR(255)'
  },
  [FormElementType.TEXTAREA]: {
    postgresql: 'TEXT',
    mysql: 'TEXT',
    mssql: 'NVARCHAR(MAX)'
  },
  [FormElementType.EMAIL]: {
    postgresql: 'VARCHAR(255)',
    mysql: 'VARCHAR(255)',
    mssql: 'NVARCHAR(255)'
  },
  [FormElementType.NUMBER]: {
    postgresql: 'NUMERIC',
    mysql: 'DECIMAL(18,2)',
    mssql: 'DECIMAL(18,2)'
  },
  [FormElementType.SELECT]: {
    postgresql: 'VARCHAR(255)',
    mysql: 'VARCHAR(255)',
    mssql: 'NVARCHAR(255)'
  },
  [FormElementType.RADIO]: {
    postgresql: 'VARCHAR(255)',
    mysql: 'VARCHAR(255)',
    mssql: 'NVARCHAR(255)'
  },
  [FormElementType.CHECKBOX]: {
    postgresql: 'TEXT[]', // Array en PostgreSQL
    mysql: 'JSON', // JSON en MySQL
    mssql: 'NVARCHAR(MAX)' // JSON stocké comme texte en MSSQL
  },
  [FormElementType.DATE]: {
    postgresql: 'DATE',
    mysql: 'DATE',
    mssql: 'DATE'
  },
  [FormElementType.PHONE]: {
    postgresql: 'VARCHAR(20)',
    mysql: 'VARCHAR(20)',
    mssql: 'NVARCHAR(20)'
  },
  [FormElementType.URL]: {
    postgresql: 'VARCHAR(255)',
    mysql: 'VARCHAR(255)',
    mssql: 'NVARCHAR(255)'
  },
  [FormElementType.SLIDER]: {
    postgresql: 'NUMERIC',
    mysql: 'DECIMAL(18,2)',
    mssql: 'DECIMAL(18,2)'
  },
  [FormElementType.TOGGLE]: {
    postgresql: 'BOOLEAN',
    mysql: 'BOOLEAN',
    mssql: 'BIT'
  },
  [FormElementType.TIME]: {
    postgresql: 'TIME',
    mysql: 'TIME',
    mssql: 'TIME'
  },
  [FormElementType.RATING]: {
    postgresql: 'INTEGER',
    mysql: 'INT',
    mssql: 'INT'
  },
  [FormElementType.ICON_SELECT]: {
    postgresql: 'VARCHAR(255)',
    mysql: 'VARCHAR(255)',
    mssql: 'NVARCHAR(255)'
  }
};

// Obtenir le type SQL approprié pour un élément de formulaire
export const getSqlType = (element: FormElement, dbType: DatabaseType): string => {
  return sqlTypeMappings[element.type][dbType];
};

// Générer une requête CREATE TABLE
export const generateCreateTableSQL = (tableName: string, elements: FormElement[], dbType: DatabaseType): string => {
  const columns = elements.map(element => {
    const columnName = element.columnName || element.label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
      
    const sqlType = getSqlType(element, dbType);
    const nullableConstraint = element.required ? 'NOT NULL' : 'NULL';
    
    return `    ${columnName} ${sqlType} ${nullableConstraint}`;
  });
  
  // Ajout d'une colonne ID primaire
  let idColumn = '';
  switch (dbType) {
    case DatabaseType.POSTGRESQL:
      idColumn = '    id SERIAL PRIMARY KEY';
      break;
    case DatabaseType.MYSQL:
      idColumn = '    id INT AUTO_INCREMENT PRIMARY KEY';
      break;
    case DatabaseType.MSSQL:
      idColumn = '    id INT IDENTITY(1,1) PRIMARY KEY';
      break;
  }
  
  const columnsWithId = [idColumn, ...columns].join(',\n');
  
  switch (dbType) {
    case DatabaseType.POSTGRESQL:
      return `CREATE TABLE IF NOT EXISTS ${tableName} (\n${columnsWithId}\n);`;
    case DatabaseType.MYSQL:
      return `CREATE TABLE IF NOT EXISTS ${tableName} (\n${columnsWithId}\n);`;
    case DatabaseType.MSSQL:
      return `IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='${tableName}' AND xtype='U')\nBEGIN\n  CREATE TABLE ${tableName} (\n${columnsWithId}\n  )\nEND`;
  }
};

// Générer une requête ALTER TABLE pour ajouter ou modifier des colonnes
export const generateAlterTableSQL = (tableName: string, elements: FormElement[], existingColumns: string[], dbType: DatabaseType): string => {
  const alterStatements: string[] = [];
  
  elements.forEach(element => {
    const columnName = element.columnName || element.label
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
      
    const sqlType = getSqlType(element, dbType);
    const nullableConstraint = element.required ? 'NOT NULL' : 'NULL';
    
    if (!existingColumns.includes(columnName)) {
      // Colonne à ajouter
      switch (dbType) {
        case DatabaseType.POSTGRESQL:
          alterStatements.push(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${sqlType} ${nullableConstraint};`);
          break;
        case DatabaseType.MYSQL:
          alterStatements.push(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${sqlType} ${nullableConstraint};`);
          break;
        case DatabaseType.MSSQL:
          alterStatements.push(`ALTER TABLE ${tableName} ADD ${columnName} ${sqlType} ${nullableConstraint};`);
          break;
      }
    } else {
      // Colonne à modifier
      switch (dbType) {
        case DatabaseType.POSTGRESQL:
          alterStatements.push(`ALTER TABLE ${tableName} ALTER COLUMN ${columnName} TYPE ${sqlType};`);
          if (element.required) {
            alterStatements.push(`ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET NOT NULL;`);
          } else {
            alterStatements.push(`ALTER TABLE ${tableName} ALTER COLUMN ${columnName} DROP NOT NULL;`);
          }
          break;
        case DatabaseType.MYSQL:
          alterStatements.push(`ALTER TABLE ${tableName} MODIFY COLUMN ${columnName} ${sqlType} ${nullableConstraint};`);
          break;
        case DatabaseType.MSSQL:
          alterStatements.push(`ALTER TABLE ${tableName} ALTER COLUMN ${columnName} ${sqlType} ${nullableConstraint};`);
          break;
      }
    }
  });
  
  return alterStatements.join('\n');
};

// Tester la connexion et exécuter une requête SQL
export const testConnection = async (connectionConfig: any, dbType: DatabaseType): Promise<boolean> => {
  // Cette fonction devrait normalement être implémentée dans une Edge Function Supabase
  // car elle nécessiterait des dépendances comme mysql, pg, mssql
  try {
    // Ici, nous appellerions l'Edge Function pour tester la connexion
    const { data, error } = await supabase.functions.invoke('test-db-connection', {
      body: { connectionConfig, dbType }
    });
    
    if (error) {
      console.error("Erreur lors du test de connexion:", error);
      return false;
    }
    
    return data?.success || false;
  } catch (error) {
    console.error("Erreur lors du test de connexion:", error);
    return false;
  }
};

// Exécuter une requête SQL
export const executeSQL = async (connectionConfig: any, dbType: DatabaseType, sql: string): Promise<any> => {
  // Cette fonction devrait être implémentée dans une Edge Function Supabase
  try {
    const { data, error } = await supabase.functions.invoke('execute-sql', {
      body: { connectionConfig, dbType, sql }
    });
    
    if (error) {
      console.error("Erreur lors de l'exécution SQL:", error);
      return { success: false, error };
    }
    
    return data || { success: false };
  } catch (error) {
    console.error("Erreur lors de l'exécution SQL:", error);
    return { success: false, error };
  }
};
