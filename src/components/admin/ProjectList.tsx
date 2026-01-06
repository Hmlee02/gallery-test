"use client";

import { useState } from "react";
import Link from "next/link";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Project = {
    id: string;
    slug: string;
    title: string;
    category: string;
    year: number;
    thumbnail: string | null;
    description: string | null;
    published: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    images: { id: string; url: string; alt: string | null; order: number; projectId: string }[];
};

interface ProjectListProps {
    initialProjects: Project[];
}

interface SortableRowProps {
    project: Project;
    onDelete: (id: string, title: string) => void;
}

function SortableRow({ project, onDelete }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className="border-t border-border/50 hover:bg-secondary/20 transition-colors"
        >
            <td className="px-3 py-4 w-12">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
                    aria-label="드래그하여 순서 변경"
                >
                    ☰
                </button>
            </td>
            <td className="px-4 py-4">
                <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="font-medium hover:text-accent transition-colors"
                >
                    {project.title}
                </Link>
            </td>
            <td className="px-4 py-4 text-muted-foreground">
                {project.category}
            </td>
            <td className="px-4 py-4 font-mono text-sm">
                {project.year}
            </td>
            <td className="px-4 py-4">
                <span
                    className={`inline-flex px-2 py-1 text-xs rounded-full ${project.published
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                >
                    {project.published ? "Published" : "Draft"}
                </span>
            </td>
            <td className="px-4 py-4 text-muted-foreground">
                {project.images.length}
            </td>
            <td className="px-4 py-4 text-right space-x-2">
                <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="text-sm text-accent hover:underline"
                >
                    Edit
                </Link>
                <button
                    onClick={() => onDelete(project.id, project.title)}
                    className="text-sm text-red-500 hover:text-red-400 hover:underline"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}

export default function ProjectList({ initialProjects }: ProjectListProps) {
    const [projects, setProjects] = useState(initialProjects);
    const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = projects.findIndex((p) => p.id === active.id);
            const newIndex = projects.findIndex((p) => p.id === over.id);

            const newProjects = arrayMove(projects, oldIndex, newIndex);
            setProjects(newProjects);

            // API 호출로 순서 저장
            const orders = newProjects.map((p, index) => ({
                id: p.id,
                order: index,
            }));

            try {
                const res = await fetch("/api/projects", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orders }),
                });

                if (!res.ok) {
                    // 실패 시 원래 순서로 복구
                    setProjects(projects);
                }
            } catch {
                setProjects(projects);
            }
        }
    };

    const handleDeleteClick = (id: string, title: string) => {
        setDeleteModal({ id, title });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/projects/${deleteModal.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setProjects(projects.filter((p) => p.id !== deleteModal.id));
                setDeleteModal(null);
            } else {
                alert("삭제에 실패했습니다.");
            }
        } catch {
            alert("삭제 중 오류가 발생했습니다.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal(null);
    };

    return (
        <>
            <div className="border border-border/50 rounded-lg overflow-hidden">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <table className="w-full">
                        <thead className="bg-secondary/30">
                            <tr>
                                <th className="w-12"></th>
                                <th className="text-left px-4 py-4 text-sm font-medium">
                                    Title
                                </th>
                                <th className="text-left px-4 py-4 text-sm font-medium">
                                    Category
                                </th>
                                <th className="text-left px-4 py-4 text-sm font-medium">
                                    Year
                                </th>
                                <th className="text-left px-4 py-4 text-sm font-medium">
                                    Status
                                </th>
                                <th className="text-left px-4 py-4 text-sm font-medium">
                                    Images
                                </th>
                                <th className="text-right px-4 py-4 text-sm font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <SortableContext
                                items={projects.map((p) => p.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {projects.map((project) => (
                                    <SortableRow
                                        key={project.id}
                                        project={project}
                                        onDelete={handleDeleteClick}
                                    />
                                ))}
                            </SortableContext>
                        </tbody>
                    </table>
                </DndContext>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-lg font-medium mb-2">프로젝트 삭제</h3>
                        <p className="text-muted-foreground mb-6">
                            &ldquo;{deleteModal.title}&rdquo; 프로젝트를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleDeleteCancel}
                                className="px-4 py-2 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                                disabled={isDeleting}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "삭제 중..." : "삭제"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
