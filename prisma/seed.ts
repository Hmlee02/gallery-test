import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig, Pool } from "@neondatabase/serverless";
import { hash } from "bcryptjs";
import { config } from "dotenv";
import path from "path";

// Load .env.local with absolute path
const envPath = path.resolve(process.cwd(), ".env.local");
config({ path: envPath, override: true });

console.log("🌱 Starting seed...");
console.log("   ENV Path:", envPath);
console.log("   DATABASE_URL:", process.env.DATABASE_URL ? "✅ Found" : "❌ Not found");

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found");
    process.exit(1);
}

// Configure Neon for serverless
neonConfig.useSecureWebSocket = true;
neonConfig.poolQueryViaFetch = true;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    // 관리자 계정 생성
    const adminEmail = "admin@aura.gallery";
    const adminPassword = "admin123";

    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingAdmin) {
        const hashedPassword = await hash(adminPassword, 12);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: "Admin",
                role: "ADMIN",
            },
        });
        console.log(`✅ Admin user created: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
    } else {
        console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
    }

    // 샘플 프로젝트 생성
    const projectCount = await prisma.project.count();
    if (projectCount === 0) {
        const sampleProjects = [
            {
                slug: "brand-identity-lumina",
                title: "Lumina Brand Identity",
                category: "Branding",
                year: 2024,
                thumbnail: "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=750&fit=crop",
                description: "A refined brand identity for Lumina, a luxury lighting company.",
            },
            {
                slug: "web-design-aether",
                title: "Aether Digital Experience",
                category: "Web Design",
                year: 2024,
                thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=750&fit=crop",
                description: "An immersive digital experience for Aether.",
            },
            {
                slug: "editorial-seasons",
                title: "Seasons Editorial",
                category: "Editorial",
                year: 2023,
                thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop",
                description: "A stunning editorial project capturing the essence of each season.",
            },
        ];

        for (let i = 0; i < sampleProjects.length; i++) {
            await prisma.project.create({
                data: { ...sampleProjects[i], order: i },
            });
        }
        console.log(`✅ Created ${sampleProjects.length} sample projects`);
    } else {
        console.log(`ℹ️  ${projectCount} projects already exist`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
