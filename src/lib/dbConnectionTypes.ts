
export enum DatabaseType {
  POSTGRESQL = 'postgresql',
  MYSQL = 'mysql',
  MSSQL = 'mssql'
}

export interface DatabaseConnection {
  id: string;
  name: string;
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  created_at?: string;
}

export const dbTypeLabels: Record<DatabaseType, string> = {
  [DatabaseType.POSTGRESQL]: 'PostgreSQL',
  [DatabaseType.MYSQL]: 'MySQL',
  [DatabaseType.MSSQL]: 'Microsoft SQL Server'
};

export const defaultPorts: Record<DatabaseType, number> = {
  [DatabaseType.POSTGRESQL]: 5432,
  [DatabaseType.MYSQL]: 3306,
  [DatabaseType.MSSQL]: 1433
};
