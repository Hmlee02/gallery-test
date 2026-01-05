import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/projects/[id] - 프로젝트 상세
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const project = await prisma.project.findFirst({
            where: {
                OR: [{ id }, { slug: id }],
            },
            include: { images: { orderBy: { order: "asc" } } },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        console.error("Failed to fetch project:", error);
        return NextResponse.json(
            { error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

// PUT /api/projects/[id] - 프로젝트 수정 (인증 필요)
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { title, slug, category, year, thumbnail, description, images, published } = body;

        // thumbnail이 없으면 첫 번째 이미지 또는 기존 thumbnail 사용
        const finalThumbnail = thumbnail || images?.[0]?.url || "";

        // year 안전하게 파싱 (숫자 또는 문자열 모두 처리)
        const parsedYear = typeof year === 'number' ? year : parseInt(year, 10);

        // 기존 이미지 삭제 후 새로 생성
        await prisma.image.deleteMany({ where: { projectId: id } });

        const project = await prisma.project.update({
            where: { id },
            data: {
                title,
                slug,
                category,
                year: parsedYear,
                thumbnail: finalThumbnail,
                description,
                published: published ?? true,
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

        return NextResponse.json(project);
    } catch (error) {
        console.error("Failed to update project:", error);
        // 더 상세한 에러 메시지 반환
        const errorMessage = error instanceof Error ? error.message : "Failed to update project";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

// DELETE /api/projects/[id] - 프로젝트 삭제 (인증 필요)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.project.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to delete project:", error);
        return NextResponse.json(
            { error: "Failed to delete project" },
            { status: 500 }
        );
    }
}
