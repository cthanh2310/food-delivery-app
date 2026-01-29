import { Pool, PoolClient, QueryResult } from "pg";
import { config } from "../config";

class Database {
    private pool: Pool;
    private static instance: Database;

    private constructor() {
        this.pool = new Pool({
            host: config.database.host,
            port: config.database.port,
            database: config.database.name,
            user: config.database.user,
            password: config.database.password,
            min: config.database.poolMin,
            max: config.database.poolMax,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // Handle pool errors
        this.pool.on("error", (err) => {
            console.error("❌ Unexpected error on idle client", err);
            process.exit(-1);
        });

        // Handle pool connection
        this.pool.on("connect", () => {
            console.log("✅ Database client connected");
        });

        // Handle pool removal
        this.pool.on("remove", () => {
            console.log("🔌 Database client removed");
        });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    /**
     * Get the pool instance
     */
    public getPool(): Pool {
        return this.pool;
    }

    /**
     * Execute a query
     */
    public async query<T extends Record<string, any> = any>(
        text: string,
        params?: any[],
    ): Promise<QueryResult<T>> {
        const start = Date.now();
        try {
            const result = await this.pool.query<T>(text, params);
            const duration = Date.now() - start;
            console.log("📊 Executed query", {
                text,
                duration,
                rows: result.rowCount,
            });
            return result;
        } catch (error) {
            console.error("❌ Query error:", error);
            throw error;
        }
    }

    /**
     * Get a client from the pool for transactions
     */
    public async getClient(): Promise<PoolClient> {
        return await this.pool.connect();
    }

    /**
     * Test database connection
     */
    public async testConnection(): Promise<boolean> {
        try {
            const result = await this.pool.query("SELECT NOW()");
            console.log("✅ Database connection successful");
            console.log("🕐 Database time:", result.rows[0].now);
            return true;
        } catch (error) {
            console.error("❌ Database connection failed:", error);
            return false;
        }
    }

    /**
     * Close all connections in the pool
     */
    public async close(): Promise<void> {
        try {
            await this.pool.end();
            console.log("👋 Database pool has ended");
        } catch (error) {
            console.error("❌ Error closing database pool:", error);
            throw error;
        }
    }

    /**
     * Execute a transaction
     */
    public async transaction<T>(
        callback: (client: PoolClient) => Promise<T>,
    ): Promise<T> {
        const client = await this.getClient();
        try {
            await client.query("BEGIN");
            const result = await callback(client);
            await client.query("COMMIT");
            return result;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }
}

// Export singleton instance
export const db = Database.getInstance();
export default Database;
