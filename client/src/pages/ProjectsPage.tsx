import { useState } from "react";
import {
  MdAdd,
  MdFolder,
  MdEdit,
  MdDelete,
  MdDescription,
  MdAccessTime,
} from "react-icons/md";
import { formatRelativeTime } from "@/utils";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useProjects";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuthStore } from "@/store/authStore";

export const ProjectsPage = () => {
  const { user } = useAuthStore();
  const { data: projects, isLoading } = useProjects();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{
    _id: string;
    name: string;
    description?: string;
  } | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleOpenDialog = (project?: any) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description || "",
      });
    } else {
      setEditingProject(null);
      setFormData({ name: "", description: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProject(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      updateMutation.mutate(
        { id: editingProject._id, data: formData },
        {
          onSuccess: () => handleCloseDialog(),
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => handleCloseDialog(),
      });
    }
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this project? This will fail if there are issues linked to it.",
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <div className="flex-1 flex flex-col w-full animate-fade-up">
      <PageHeader
        title="Projects"
        subtitle="Manage your workspaces and organize issues"
        actions={
          <button
            onClick={() => handleOpenDialog()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold shadow-lg shadow-brand-500/20 transition-all duration-300"
          >
            <MdAdd size={20} />
            Add Project
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-3xl bg-secondary/20 animate-pulse border border-border/50"
            />
          ))
        ) : projects?.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-secondary/30 flex items-center justify-center text-muted-foreground/30">
              <MdFolder size={40} />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground">
                No projects found
              </h3>
              <p className="text-muted-foreground max-w-xs">
                Create your first project to start organizing your issues
                effectively.
              </p>
            </div>
            <button
              onClick={() => handleOpenDialog()}
              className="px-6 py-2.5 rounded-xl bg-secondary text-foreground hover:bg-border transition-colors font-semibold text-sm"
            >
              Get Started
            </button>
          </div>
        ) : (
          projects?.map((project) => (
            <div
              key={project._id}
              className="group relative bg-card border border-border/60 rounded-3xl p-6 hover:shadow-2xl hover:shadow-brand-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-brand-500/10 transition-colors duration-500" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                    <MdFolder size={24} />
                  </div>

                  {isAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenDialog(project)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-brand-500 hover:bg-brand-500/10 transition-colors"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-brand-500 transition-colors mb-1.5">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 font-medium leading-relaxed">
                    {project.description ||
                      "No description provided for this project."}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground border border-border/50">
                      {project.createdBy?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {project.createdBy?.name || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest">
                    <MdAccessTime size={12} />
                    {formatRelativeTime(project.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={handleCloseDialog}
          />

          <div className="relative bg-card w-full max-w-md border border-border/80 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-foreground tracking-tighter mb-1.5">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>
            <p className="text-sm text-muted-foreground font-medium mb-8">
              {editingProject
                ? "Update existing project details"
                : "Create a new container for your issues"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                  <MdFolder className="text-brand-500" size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Project Name
                  </label>
                </div>
                <input
                  autoFocus
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g. Phoenix Redux"
                  className="w-full px-5 py-4 rounded-2xl bg-secondary/30 border border-border focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                  <MdDescription className="text-brand-500" size={14} />
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Description
                  </label>
                </div>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="What is this project about?"
                  className="w-full px-5 py-4 rounded-2xl bg-secondary/30 border border-border focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all font-medium resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="flex-1 px-6 py-4 rounded-2xl bg-secondary text-foreground hover:bg-border transition-colors font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="flex-[2] px-6 py-4 rounded-2xl bg-brand-500 text-white font-bold text-sm shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all hover:shadow-brand-500/30 disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Processing..."
                    : editingProject
                      ? "Save Changes"
                      : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
