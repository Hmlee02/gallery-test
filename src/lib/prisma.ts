import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, Pool } from "@neondatabase/serverless";

// Configure Neon for serverless environment
neonConfig.useSecureWebSocket = true;
neonConfig.poolQueryViaFetch = true;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        throw new Error("DATABASE_URL is not set");
    }

    const pool = new Pool({ connectionString });
    // @ts-expect-error - Prisma adapter types mismatch with Neon Pool
    const adapter = new PrismaNeon(pool);

    globalForPrisma.pool = pool;
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
