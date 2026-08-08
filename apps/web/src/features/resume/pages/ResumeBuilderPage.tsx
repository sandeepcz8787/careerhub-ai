import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { resumeApiService } from '../services/resume.service';
import { Button } from '@shared/components/ui/Button';
import { Card, CardHeader, CardBody, CardFooter } from '@shared/components/ui/Card';
import { EmptyState } from '@shared/components/ui/EmptyState';
import { Modal } from '@shared/components/ui/Modal';
import { Input } from '@shared/components/ui/Input';
import { useToast } from '@shared/components/ui/Toast';

export default function ResumeBuilderPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [isRenameOpen, setIsRenameOpen] = useState(false);

  // Queries
  const { data: resumes = [], isLoading, error } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApiService.getResumes(),
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => resumeApiService.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      success('Resume deleted successfully');
    },
    onError: () => toastError('Failed to delete resume'),
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => resumeApiService.duplicateResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      success('Resume duplicated successfully');
    },
    onError: () => toastError('Failed to duplicate resume'),
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => resumeApiService.setDefaultResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      success('Primary default resume updated');
    },
    onError: () => toastError('Failed to set default resume'),
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      resumeApiService.updateResume(id, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setIsRenameOpen(false);
      setRenameId(null);
      success('Resume renamed successfully');
    },
    onError: () => toastError('Failed to rename resume'),
  });

  const handleRenameClick = (id: string, currentTitle: string) => {
    setRenameId(id);
    setRenameTitle(currentTitle);
    setIsRenameOpen(true);
  };

  const handleRenameSubmit = () => {
    if (!renameTitle.trim()) {
      toastError('Title cannot be empty');
      return;
    }
    if (renameId) {
      renameMutation.mutate({ id: renameId, title: renameTitle.trim() });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-100 bg-red-50/50">
          <CardBody className="flex flex-col items-center justify-center p-8 text-center text-red-700">
            <svg className="w-12 h-12 mb-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-lg font-bold mb-2">Failed to load Resumes</h3>
            <p className="text-sm mb-4">There was a network error fetching your resumes. Please try again.</p>
            <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['resumes'] })}>
              Retry
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-[color:var(--bg-base)] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[color:var(--text-primary)]">
            My Resumes
          </h1>
          <p className="text-sm text-[color:var(--text-muted)] mt-1">
            Build and tailor ATS-friendly resumes for your applications.
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/resume-builder/create')}
          leftIcon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Create Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <EmptyState
          title="No Resumes Yet"
          description="You haven't built any resume versions yet. Click below to start our guided builder flow!"
          action={
            <Button variant="primary" onClick={() => navigate('/resume-builder/create')}>
              Build First Resume
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card 
              key={resume.id} 
              className={`group hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col border ${
                resume.isPrimary ? 'border-primary-500 shadow-md shadow-primary-500/5' : 'border-[color:var(--border-default)]'
              }`}
            >
              {/* Highlight bar for Primary */}
              {resume.isPrimary && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500" />
              )}

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-md text-[color:var(--text-primary)] truncate max-w-[70%]">
                    {resume.title}
                  </h3>
                  <div className="flex gap-1">
                    {resume.isPrimary && (
                      <span className="text-[10px] bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 font-bold px-2 py-0.5 rounded-full shrink-0">
                        Default
                      </span>
                    )}
                    {resume.privacy !== 'private' && (
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full shrink-0 uppercase">
                        {resume.privacy}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-[color:var(--text-muted)] mt-1">
                  Updated: {new Date(resume.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </CardHeader>

              <CardBody className="py-2 flex-grow">
                <p className="text-xs text-[color:var(--text-secondary)]">
                  Sections: {(resume.sections || []).length} items included.
                </p>
                {resume.publicShareLink && (
                  <div className="mt-2 py-1 px-2 rounded bg-[color:var(--bg-subtle)] text-[10px] border border-[color:var(--border-default)] font-mono text-[color:var(--text-secondary)] truncate">
                    Share: {resume.publicShareLink}
                  </div>
                )}
              </CardBody>

              <CardFooter className="pt-2 border-t border-[color:var(--border-default)] flex justify-between items-center gap-2">
                <div className="flex gap-1.5">
                  <Button 
                    variant="primary" 
                    size="xs"
                    onClick={() => navigate(`/resume-builder/edit/${resume.id}`)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="xs"
                    onClick={() => duplicateMutation.mutate(resume.id)}
                    isLoading={duplicateMutation.isPending && duplicateMutation.variables === resume.id}
                  >
                    Duplicate
                  </Button>
                </div>

                <div className="flex gap-1">
                  {/* Actions Dropdown / Icons */}
                  {!resume.isPrimary && (
                    <button
                      title="Set as Default"
                      className="p-1.5 rounded hover:bg-[color:var(--bg-subtle)] text-[color:var(--text-muted)] hover:text-primary-500 transition-colors"
                      onClick={() => setDefaultMutation.mutate(resume.id)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}

                  <button
                    title="Rename"
                    className="p-1.5 rounded hover:bg-[color:var(--bg-subtle)] text-[color:var(--text-muted)] hover:text-slate-800 transition-colors"
                    onClick={() => handleRenameClick(resume.id, resume.title)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  <button
                    title="Delete"
                    className="p-1.5 rounded hover:bg-[color:var(--bg-subtle)] text-error-400 hover:text-error-600 transition-colors"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this resume?')) {
                        deleteMutation.mutate(resume.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Rename Modal */}
      <Modal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        title="Rename Resume"
      >
        <div className="py-4 space-y-4">
          <Input
            label="Resume Title"
            value={renameTitle}
            onChange={(e) => setRenameTitle(e.target.value)}
            placeholder="e.g. Frontend Engineer Resume"
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-[color:var(--border-default)]">
            <Button variant="secondary" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleRenameSubmit}
              isLoading={renameMutation.isPending}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
