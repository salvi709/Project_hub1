import React, { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  FileText,
  Link2,
  Paperclip,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { formatShortDate } from '../lib/date';
import { useWorkspace } from '../features/workspace/WorkspaceContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../components/ui/ToastProvider';

export const NotesPage: React.FC = () => {
  const { projects, notes, getProjectById, createNote, updateNote, deleteNote } =
    useWorkspace();
  const { toast } = useToast();

  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id ?? null);

  // Editor form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState('');
  const [resourceLinks, setResourceLinks] = useState<{ label: string; url: string }[]>([]);
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);

  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newAttachment, setNewAttachment] = useState('');

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes.filter((n) => {
      if (projectFilter === 'general' && n.projectId !== null) return false;
      if (projectFilter !== 'all' && projectFilter !== 'general' && n.projectId !== projectFilter) {
        return false;
      }
      if (
        q &&
        !n.title.toLowerCase().includes(q) &&
        !n.content.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [notes, search, projectFilter]);

  const activeNote = useMemo(
    () => notes.find((n) => n.id === selectedNoteId) ?? null,
    [notes, selectedNoteId]
  );

  useEffect(() => {
    if (!activeNote && filteredNotes.length > 0 && selectedNoteId !== 'new') {
      setSelectedNoteId(filteredNotes[0].id);
    }
  }, [activeNote, filteredNotes, selectedNoteId]);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title);
      setContent(activeNote.content);
      setProjectId(activeNote.projectId ?? '');
      setResourceLinks(activeNote.resourceLinks);
      setAttachmentNames(activeNote.attachmentNames);
    } else if (selectedNoteId === 'new') {
      setTitle('');
      setContent('');
      setProjectId('');
      setResourceLinks([]);
      setAttachmentNames([]);
    }
  }, [activeNote, selectedNoteId]);

  const handleNewNote = () => {
    setSelectedNoteId('new');
    setTitle('');
    setContent('');
    setProjectId(projectFilter !== 'all' && projectFilter !== 'general' ? projectFilter : '');
    setResourceLinks([]);
    setAttachmentNames([]);
  };

  const handleAddLink = () => {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    const normalizedUrl = newLinkUrl.trim().startsWith('http')
      ? newLinkUrl.trim()
      : `https://${newLinkUrl.trim()}`;
    setResourceLinks((prev) => [...prev, { label: newLinkLabel.trim(), url: normalizedUrl }]);
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  const handleAddAttachment = () => {
    if (!newAttachment.trim()) return;
    setAttachmentNames((prev) => [...prev, newAttachment.trim()]);
    setNewAttachment('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (activeNote) {
      updateNote(activeNote.id, {
        title,
        content,
        projectId: projectId || null,
        resourceLinks,
        attachmentNames,
      });
      toast({ title: 'Note saved', description: title.trim(), variant: 'success' });
    } else {
      const created = createNote({
        title,
        content,
        projectId: projectId || null,
        resourceLinks,
        attachmentNames,
      });
      setSelectedNoteId(created.id);
      toast({ title: 'Note created', description: created.title, variant: 'success' });
    }
  };

  const handleDelete = () => {
    if (!activeNote) return;
    const deletedTitle = activeNote.title;
    deleteNote(activeNote.id);
    setSelectedNoteId(null);
    toast({ title: 'Note deleted', description: deletedTitle });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--ph-text-primary)]">
            Notes &amp; Resources
          </h2>
          <p className="mt-1 text-sm text-[var(--ph-text-secondary)]">
            Organize project specs, technical notes, reference URLs, and attachment metadata.
          </p>
        </div>

        <Button size="sm" onClick={handleNewNote}>
          <Plus className="h-3.5 w-3.5" />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left List */}
        <Card className="flex flex-col lg:col-span-4">
          <div className="space-y-2.5 border-b border-[var(--ph-border)] p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--ph-text-muted)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="pl-8"
              />
            </div>

            <Select
              aria-label="Filter notes by project"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="all">All projects</option>
              <option value="general">General Notes</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex-1 divide-y divide-[var(--ph-border)] overflow-y-auto p-2 max-h-[560px]">
            {filteredNotes.length === 0 ? (
              <p className="py-10 text-center text-xs text-[var(--ph-text-muted)]">
                No notes match the current filter.
              </p>
            ) : (
              filteredNotes.map((note) => {
                const selected = selectedNoteId === note.id;
                const proj = getProjectById(note.projectId);
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`w-full rounded-md p-3 text-left transition-colors cursor-pointer ${
                      selected ? 'bg-[var(--ph-accent-soft)]' : 'hover:bg-[var(--ph-bg-hover)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-[var(--ph-text-primary)]">
                        {note.title}
                      </span>
                      <span className="shrink-0 text-[10px] text-[var(--ph-text-muted)]">
                        {formatShortDate(note.updatedAt)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-[var(--ph-text-secondary)]">
                      {note.content || 'Empty note'}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-[var(--ph-text-muted)]">
                      <span>{proj?.name ?? 'General'}</span>
                      {note.resourceLinks.length > 0 && (
                        <span>· {note.resourceLinks.length} links</span>
                      )}
                      {note.attachmentNames.length > 0 && (
                        <span>· {note.attachmentNames.length} files</span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        {/* Editor */}
        <Card className="p-5 lg:col-span-8">
          {selectedNoteId === null && notes.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-5 w-5" />}
              title="No notes created yet"
              description="Capture architectural notes, meeting takeaways, and reference links."
              action={
                <Button size="sm" onClick={handleNewNote}>
                  <Plus className="h-3.5 w-3.5" />
                  Create first note
                </Button>
              }
            />
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Input
                    required
                    placeholder="Note title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-base font-semibold"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select
                    aria-label="Associate project"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                  >
                    <option value="">General Notes</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write specifications, research notes, or action items..."
                className="min-h-[200px] leading-relaxed"
              />

              {/* Resource Links */}
              <div className="space-y-3 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ph-text-primary)]">
                    <Link2 className="h-3.5 w-3.5 text-[var(--ph-accent-text)]" />
                    Resource Links ({resourceLinks.length})
                  </span>
                </div>

                {resourceLinks.length > 0 && (
                  <div className="space-y-1.5">
                    {resourceLinks.map((link, idx) => (
                      <div
                        key={`${link.url}-${idx}`}
                        className="flex items-center justify-between gap-2 rounded-md border border-[var(--ph-border)] bg-[var(--ph-bg-card)] px-3 py-1.5 text-xs"
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-w-0 items-center gap-1.5 font-medium text-[var(--ph-accent-text)] hover:underline"
                        >
                          <span className="truncate">{link.label}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            setResourceLinks((prev) => prev.filter((_, i) => i !== idx))
                          }
                          aria-label="Remove link"
                          className="text-[var(--ph-text-muted)] hover:text-[var(--ph-error)] cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-12">
                  <Input
                    placeholder="Link label (e.g., API Spec)"
                    value={newLinkLabel}
                    onChange={(e) => setNewLinkLabel(e.target.value)}
                    className="h-8 text-xs sm:col-span-4"
                  />
                  <Input
                    placeholder="https://..."
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="h-8 text-xs sm:col-span-6"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddLink}
                    className="sm:col-span-2"
                  >
                    Add link
                  </Button>
                </div>
              </div>

              {/* Attachment Metadata */}
              <div className="space-y-3 rounded-lg border border-[var(--ph-border)] bg-[var(--ph-bg-secondary)] p-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ph-text-primary)]">
                  <Paperclip className="h-3.5 w-3.5 text-[var(--ph-text-secondary)]" />
                  Attachment Metadata ({attachmentNames.length})
                </span>

                {attachmentNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attachmentNames.map((file, idx) => (
                      <Badge key={`${file}-${idx}`} variant="neutral" className="gap-1.5 py-1">
                        <span className="font-mono">{file}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setAttachmentNames((prev) => prev.filter((_, i) => i !== idx))
                          }
                          aria-label={`Remove ${file}`}
                          className="text-[var(--ph-text-muted)] hover:text-[var(--ph-error)] cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Reference filename (e.g., architecture-v1.pdf)"
                    value={newAttachment}
                    onChange={(e) => setNewAttachment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAttachment();
                      }
                    }}
                    className="h-8 text-xs"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={handleAddAttachment}>
                    Attach ref
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {activeNote ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-[var(--ph-error)]"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete note
                  </Button>
                ) : (
                  <span />
                )}

                <Button type="submit" size="sm">
                  {activeNote ? 'Save note' : 'Create note'}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
