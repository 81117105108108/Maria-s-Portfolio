import { ProjectForm } from '@/components/admin/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-brand-900">
          New Project
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Create a new portfolio project
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
