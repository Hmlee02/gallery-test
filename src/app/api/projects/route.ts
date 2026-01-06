import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/projects - 전체 프로젝트 목록
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            where: { published: true },
            include: { images: { orderBy: { order: "asc" } } },
            orderBy: { order: "asc" },
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error("Failed to fetch projects:", error);
        return NextResponse.json(
            { error: "Failed to fetch projects" },
            { status: 500 }
        );
    }
}

// POST /api/projects - 새 프로젝트 생성 (인증 필요)
export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, slug, category, year, thumbnail, description, images } = body;

        // 유효성 검사 - 필드별 상세 메시지
        const missingFields: string[] = [];
        if (!title) missingFields.push("title");
        if (!slug) missingFields.push("slug");
        if (!category) missingFields.push("category");
        if (!year) missingFields.push("year");
        if (!description) missingFields.push("description");

        if (missingFields.length > 0) {
            return NextResponse.json(
                { error: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        // thumbnail이 없으면 첫 번째 이미지 사용
        const finalThumbnail = thumbnail || images?.[0]?.url || "";

        // 중복 slug 체크
        const existing = await prisma.project.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json(
                { error: "Slug already exists" },
                { status: 400 }
            );
        }

        const project = await prisma.project.create({
            data: {
                title,
                slug,
                category,
                year: parseInt(year),
                thumbnail: finalThumbnail,
                description,
                images: images?.length
                    ? {
                        create: images.map((img: { url: string; alt?: string }, i: number) => ({
                            url: img.url,
                            alt: img.alt || "",
                            order: i,
                        })),
                    }
                    : undefined,
            },
            include: { images: true },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error("Failed to create project:", error);
        return NextResponse.json(
            { error: "Failed to create project" },
            { status: 500 }
        );
    }
}

// PUT /api/projects - 순서 일괄 변경 (인증 필요)
export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { orders } = body as { orders: { id: string; order: number }[] };

        if (!orders || !Array.isArray(orders)) {
            return NextResponse.json(
                { error: "Invalid orders array" },
                { status: 400 }
            );
        }

        // 트랜잭션으로 모든 순서 업데이트
        await prisma.$transaction(
            orders.map(({ id, order }) =>
                prisma.project.update({
                    where: { id },
                    data: { order },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to reorder projects:", error);
        return NextResponse.json(
            { error: "Failed to reorder projects" },
            { status: 500 }
        );
    }
}
