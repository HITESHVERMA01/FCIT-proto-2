import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  Eye,
  EyeSlash,
  Image as ImageIcon,
  PencilSimple,
  Plus,
  Trash,
  UploadSimple,
  X,
} from '@phosphor-icons/react';
import { api, resolveMediaUrl } from '../../services/api';
import { ProfilePortrait } from '../people/ProfilePortrait';
import {
  CardGridSkeleton,
  EmptyState,
  ErrorState,
  StatusBanner,
} from '../shared/StateViews';

/**
 * Reusable CRUD + Photo Upload + Publish Toggle + Reorder Workspace
 * for Admin Dashboard collections.
 */
export function AdminResourceManager({
  title,
  endpoint,
  fields,
  photoField = '',
  supportsReorder = false,
  supportsVerification = false,
  supportsAdditionalImages = false,
  titleField = 'title',
  subtitleField = '',
  canDelete = true,
  onMutate,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [formState, setFormState] = useState({});
  const [pendingPhotoFile, setPendingPhotoFile] = useState(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState('');
  const [removeExistingPhoto, setRemoveExistingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!pendingPhotoFile || typeof window === 'undefined' || !window.URL?.createObjectURL) {
      setPendingPreviewUrl('');
      return undefined;
    }
    const url = window.URL.createObjectURL(pendingPhotoFile);
    setPendingPreviewUrl(url);
    return () => window.URL.revokeObjectURL(url);
  }, [pendingPhotoFile]);

  const buildInitialForm = (item = null) => {
    const initial = {};
    fields.forEach((f) => {
      const raw = item ? item[f.name] : f.defaultValue;
      if (f.type === 'tags') {
        initial[f.name] = Array.isArray(raw) ? raw.join(', ') : String(raw || '');
      } else if (f.type === 'date' && raw) {
        initial[f.name] = String(raw).slice(0, 10);
      } else if (f.type === 'checkbox') {
        initial[f.name] = Boolean(raw);
      } else {
        initial[f.name] = raw ?? '';
      }
    });
    return initial;
  };

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`${endpoint}?includeDrafts=true`);
      setItems(res?.data || []);
    } catch (err) {
      setError(err?.message || `Failed to load ${title}.`);
    } finally {
      setLoading(false);
    }
  }, [endpoint, title]);

  useEffect(() => {
    setEditingItem(null);
    setPendingPhotoFile(null);
    setRemoveExistingPhoto(false);
    setStatus({ type: '', message: '' });
    fetchItems();
  }, [fetchItems]);

  const startCreate = () => {
    setEditingItem('new');
    setFormState(buildInitialForm(null));
    setPendingPhotoFile(null);
    setRemoveExistingPhoto(false);
    setStatus({ type: '', message: '' });
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormState(buildInitialForm(item));
    setPendingPhotoFile(null);
    setRemoveExistingPhoto(false);
    setStatus({ type: '', message: '' });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });
    const isNew = editingItem === 'new';

    try {
      const payload = {};
      fields.forEach((f) => {
        const val = formState[f.name];
        if (f.type === 'tags') {
          payload[f.name] = String(val || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        } else if (f.type === 'number') {
          payload[f.name] = Number(val || 0);
        } else if (f.type === 'date') {
          payload[f.name] = val ? val : null;
        } else {
          payload[f.name] = val;
        }
      });

      const res = isNew
        ? await api.post(endpoint, payload)
        : await api.put(`${endpoint}/${editingItem._id}`, payload);
      const savedRecord = res?.data;

      let photoError = '';
      if (photoField && savedRecord?._id) {
        if (pendingPhotoFile) {
          const fd = new FormData();
          fd.append('image', pendingPhotoFile);
          try {
            await api.post(`${endpoint}/${savedRecord._id}/photo`, fd);
          } catch (uploadErr) {
            photoError = uploadErr?.message || 'Image upload failed.';
          }
        } else if (!isNew && removeExistingPhoto && editingItem?.[photoField]) {
          try {
            await api.del(`${endpoint}/${savedRecord._id}/photo`);
          } catch (rmErr) {
            photoError = rmErr?.message || 'Could not remove existing photo.';
          }
        }
      }

      setEditingItem(null);
      setPendingPhotoFile(null);
      setRemoveExistingPhoto(false);
      await fetchItems();
      onMutate?.();

      if (photoError) {
        setStatus({
          type: 'error',
          message: `Record saved, but media update failed: ${photoError}`,
        });
      } else {
        setStatus({
          type: 'success',
          message: isNew ? `${title} record created.` : `${title} record updated.`,
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.message || 'Unable to save record. Review the inputs.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item) => {
    setStatus({ type: '', message: '' });
    try {
      await api.patch(`${endpoint}/${item._id}/publish`, {
        isPublished: !item.isPublished,
      });
      setStatus({
        type: 'success',
        message: `${item[titleField]} ${!item.isPublished ? 'published' : 'moved to draft'}.`,
      });
      await fetchItems();
      onMutate?.();
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Could not toggle publish state.' });
    }
  };

  const handlePhotoUpload = async (item, file) => {
    if (!file) return;
    setStatus({ type: '', message: '' });
    const fd = new FormData();
    fd.append('image', file);
    try {
      await api.post(`${endpoint}/${item._id}/photo`, fd);
      setStatus({ type: 'success', message: `Photo updated for ${item[titleField]}.` });
      await fetchItems();
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Photo upload failed.' });
    }
  };

  const handlePhotoRemove = async (item) => {
    setStatus({ type: '', message: '' });
    try {
      await api.del(`${endpoint}/${item._id}/photo`);
      setStatus({ type: 'success', message: `Photo removed for ${item[titleField]}.` });
      await fetchItems();
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Could not remove photo.' });
    }
  };

  const handleMove = async (index, delta) => {
    const swapIdx = index + delta;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const reordered = [...items];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(swapIdx, 0, moved);
    const payload = reordered.map((it, idx) => ({ id: it._id, displayOrder: idx }));
    setItems(reordered);
    try {
      await api.patch(`${endpoint}/reorder`, { items: payload });
      setStatus({ type: 'success', message: 'Display order updated.' });
      onMutate?.();
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Reorder failed.' });
      await fetchItems();
    }
  };

  const handleDelete = async (item) => {
    setStatus({ type: '', message: '' });
    try {
      await api.del(`${endpoint}/${item._id}`);
      setStatus({ type: 'success', message: `Deleted ${item[titleField]}.` });
      await fetchItems();
      onMutate?.();
    } catch (err) {
      setStatus({ type: 'error', message: err?.message || 'Delete failed.' });
    }
  };

  const handleToggleVerification = async (item) => {
    setStatus({ type: '', message: '' });
    const nextStatus =
      item.verificationStatus === 'verified' ? 'pending_verification' : 'verified';
    try {
      await api.patch(`${endpoint}/${item._id}/verification`, {
        verificationStatus: nextStatus,
      });
      setStatus({
        type: 'success',
        message: `${item[titleField]} marked ${
          nextStatus === 'verified' ? 'Verified' : 'Pending Verification'
        }.`,
      });
      await fetchItems();
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.message || 'Could not update verification status.',
      });
    }
  };

  const handleAdditionalPhotoUpload = async (item, file) => {
    if (!file) return;
    setStatus({ type: '', message: '' });
    const fd = new FormData();
    fd.append('image', file);
    try {
      await api.post(`${endpoint}/${item._id}/additional-images`, fd);
      setStatus({
        type: 'success',
        message: `Additional archival photo added to ${item[titleField]}.`,
      });
      await fetchItems();
    } catch (err) {
      setStatus({
        type: 'error',
        message: err?.message || 'Additional image upload failed.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="heading-4 text-fcit-navyDeep">{title}</h2>
          <p className="body-6 text-fcit-muted">
            Create, edit, reorder, upload verified photographs, and control public visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-3 py-2 button-sm text-fcit-cream hover:bg-fcit-navy"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Add New Record</span>
        </button>
      </div>

      <StatusBanner type={status.type} message={status.message} />

      {/* Create / Edit Form Drawer */}
      {editingItem && (
        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-fcit-navy/20 bg-fcit-ivory p-6 space-y-5"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="heading-6 text-fcit-navyDeep">
              {editingItem === 'new' ? `New ${title} Entry` : `Edit ${editingItem[titleField]}`}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setPendingPhotoFile(null);
                setRemoveExistingPhoto(false);
              }}
              aria-label="Cancel form"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-cream text-fcit-navyDeep"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>

          {photoField && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 rounded-xl border border-fcit-navy/15 bg-fcit-cream/90 p-4">
              {(() => {
                const existingSrc =
                  editingItem !== 'new' && !removeExistingPhoto ? editingItem[photoField] : '';
                const previewSrc = pendingPreviewUrl || existingSrc;
                const isPortrait = photoField === 'photo';
                if (isPortrait) {
                  return (
                    <ProfilePortrait
                      src={previewSrc}
                      alt={formState.name || 'Live portrait preview'}
                      variant={0}
                      objectPosition={formState.photoPosition || 'object-top'}
                      widthClass="w-28"
                      aspectClass="aspect-[4/5]"
                      className="shrink-0 rounded-xl border border-fcit-navy/15"
                    />
                  );
                }
                const resolved = resolveMediaUrl(previewSrc);
                return (
                  <div className="h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-fcit-navy/15 bg-fcit-ivory flex items-center justify-center">
                    {resolved ? (
                      <img
                        src={resolved}
                        alt={formState[titleField] || 'Media preview'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon size={24} className="text-fcit-muted" aria-hidden="true" />
                    )}
                  </div>
                );
              })()}

              <div className="space-y-2">
                <p className="title-4 text-fcit-navyDeep">
                  {photoField === 'photo' ? 'Portrait Preview (Live Frame)' : 'Media Preview'}
                </p>
                <p className="caption-4 text-fcit-muted">
                  {pendingPreviewUrl
                    ? 'New image queued. Click Save Record to upload and publish.'
                    : editingItem !== 'new' && editingItem[photoField] && !removeExistingPhoto
                      ? 'Showing currently stored image. Choose a replacement or remove it.'
                      : photoField === 'photo'
                        ? 'No photograph uploaded yet. Public cards show a monochrome geometric silhouette automatically.'
                        : 'Select a verified JPEG, PNG, or WebP file to attach on save.'}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-fcit-navy/20 bg-fcit-ivory px-3 py-1.5 caption-3 text-fcit-navyDeep hover:bg-fcit-lemonSoft">
                    <UploadSimple size={14} aria-hidden="true" />
                    <span>{pendingPhotoFile ? 'Choose Another File' : 'Select Image'}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setPendingPhotoFile(f);
                          setRemoveExistingPhoto(false);
                        }
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {pendingPhotoFile && (
                    <button
                      type="button"
                      onClick={() => setPendingPhotoFile(null)}
                      className="rounded-lg border border-fcit-navy/15 bg-fcit-ivory px-2.5 py-1.5 caption-3 text-fcit-secondary hover:bg-fcit-roseSoft"
                    >
                      Clear Queued File
                    </button>
                  )}
                  {editingItem !== 'new' && editingItem[photoField] && !removeExistingPhoto && !pendingPhotoFile && (
                    <button
                      type="button"
                      onClick={() => setRemoveExistingPhoto(true)}
                      className="rounded-lg border border-fcit-navy/15 bg-fcit-ivory px-2.5 py-1.5 caption-3 text-fcit-secondary hover:bg-fcit-roseSoft"
                    >
                      Mark Photo for Removal
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => {
              const id = `admin-field-${f.name}`;
              const fullWidth = f.type === 'textarea' || f.fullWidth;

              if (f.type === 'checkbox') {
                return (
                  <label key={f.name} className="flex items-center gap-2 sm:col-span-2 pt-2">
                    <input
                      type="checkbox"
                      checked={Boolean(formState[f.name])}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, [f.name]: e.target.checked }))
                      }
                      className="h-4 w-4 accent-[#0B2747]"
                    />
                    <span className="title-4 text-fcit-navyDeep">{f.label}</span>
                  </label>
                );
              }

              return (
                <div key={f.name} className={fullWidth ? 'sm:col-span-2' : ''}>
                  <label htmlFor={id} className="title-4 text-fcit-navyDeep block mb-1">
                    {f.label}
                  </label>

                  {f.type === 'textarea' ? (
                    <textarea
                      id={id}
                      rows={3}
                      required={f.required}
                      value={formState[f.name] ?? ''}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, [f.name]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      id={id}
                      value={formState[f.name] ?? ''}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, [f.name]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                    >
                      {f.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={id}
                      type={f.type || 'text'}
                      required={f.required}
                      placeholder={f.placeholder || ''}
                      value={formState[f.name] ?? ''}
                      onChange={(e) =>
                        setFormState((s) => ({ ...s, [f.name]: e.target.value }))
                      }
                      className="w-full rounded-lg border border-fcit-navy/20 bg-fcit-cream px-3 py-2 body-6 text-fcit-ink"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-fcit-navyDeep px-4 py-2 button-sm text-fcit-cream hover:bg-fcit-navy disabled:opacity-60"
            >
              <Check size={16} aria-hidden="true" />
              <span>{saving ? 'Saving...' : 'Save Record'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingItem(null);
                setPendingPhotoFile(null);
                setRemoveExistingPhoto(false);
              }}
              className="rounded-lg border border-fcit-navy/20 bg-fcit-cream px-4 py-2 button-sm text-fcit-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List */}
      {loading ? (
        <CardGridSkeleton count={3} columns="grid-cols-1" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchItems} />
      ) : items.length === 0 ? (
        <EmptyState
          title={`No ${title.toLowerCase()} records created yet`}
          description="Use Add New Record above to create an authentic draft or published item."
        />
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const imgUrl = photoField ? resolveMediaUrl(item[photoField]) : '';
            return (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-fcit-navy/15 bg-fcit-ivory/85 p-4"
              >
                <div className="flex items-start gap-4">
                  {photoField && (
                    photoField === 'photo' ? (
                      <ProfilePortrait
                        src={item[photoField]}
                        alt={item[titleField]}
                        variant={idx}
                        objectPosition={item.photoPosition || 'object-top'}
                        widthClass="w-16"
                        aspectClass="aspect-[4/5]"
                        className="shrink-0 rounded-xl border border-fcit-navy/15"
                      />
                    ) : (
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-fcit-navy/15 bg-fcit-cream flex items-center justify-center">
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={item[titleField]}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={22} className="text-fcit-muted" aria-hidden="true" />
                        )}
                      </div>
                    )
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="title-2 text-fcit-navyDeep">{item[titleField]}</h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 caption-5 ${
                          item.isPublished
                            ? 'border-[#1C4B2C]/25 bg-fcit-sage text-[#1C4B2C]'
                            : 'border-fcit-navy/15 bg-fcit-cream text-fcit-muted'
                        }`}
                      >
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                      {supportsVerification && (
                        <span
                          className={`rounded-full border px-2 py-0.5 caption-5 ${
                            item.verificationStatus === 'verified'
                              ? 'border-fcit-navy/25 bg-fcit-periwinkle/55 text-fcit-navyDeep'
                              : 'border-fcit-navy/15 bg-fcit-lemonSoft text-fcit-goldInk'
                          }`}
                        >
                          {item.verificationStatus === 'verified'
                            ? 'Verified Source'
                            : 'Pending Verification'}
                        </span>
                      )}
                    </div>
                    {subtitleField && item[subtitleField] && (
                      <p className="body-6 text-fcit-secondary">{item[subtitleField]}</p>
                    )}
                    {supportsAdditionalImages &&
                      Array.isArray(item.additionalImages) &&
                      item.additionalImages.length > 0 && (
                        <p className="caption-5 text-fcit-muted mt-0.5">
                          {item.additionalImages.length} additional archival image
                          {item.additionalImages.length > 1 ? 's' : ''}
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {supportsReorder && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        aria-label="Move item up"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-cream text-fcit-navyDeep disabled:opacity-40"
                      >
                        <ArrowUp size={14} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === items.length - 1}
                        aria-label="Move item down"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-fcit-navy/15 bg-fcit-cream text-fcit-navyDeep disabled:opacity-40"
                      >
                        <ArrowDown size={14} aria-hidden="true" />
                      </button>
                    </>
                  )}

                  {photoField && (
                    <>
                      <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-fcit-navy/20 bg-fcit-cream px-2.5 py-1.5 caption-3 text-fcit-navyDeep hover:bg-fcit-lemonSoft">
                        <UploadSimple size={14} aria-hidden="true" />
                        <span>{imgUrl ? 'Replace Photo' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handlePhotoUpload(item, f);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {imgUrl && (
                        <button
                          type="button"
                          onClick={() => handlePhotoRemove(item)}
                          className="rounded-lg border border-fcit-navy/20 bg-fcit-cream px-2.5 py-1.5 caption-3 text-fcit-secondary hover:bg-fcit-roseSoft"
                        >
                          Remove Photo
                        </button>
                      )}
                    </>
                  )}

                  {supportsAdditionalImages && (
                    <label className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-fcit-navy/20 bg-fcit-cream px-2.5 py-1.5 caption-3 text-fcit-navyDeep hover:bg-fcit-lemonSoft">
                      <UploadSimple size={14} aria-hidden="true" />
                      <span>Add Extra Photo</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleAdditionalPhotoUpload(item, f);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  )}

                  {supportsVerification && (
                    <button
                      type="button"
                      onClick={() => handleToggleVerification(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-fcit-navy/20 bg-fcit-cream px-2.5 py-1.5 caption-3 text-fcit-navyDeep hover:bg-fcit-lemonSoft"
                    >
                      <span>
                        {item.verificationStatus === 'verified'
                          ? 'Mark Pending'
                          : 'Mark Verified'}
                      </span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-fcit-navy/20 bg-fcit-cream px-2.5 py-1.5 caption-3 text-fcit-navyDeep hover:bg-fcit-lemonSoft"
                  >
                    {item.isPublished ? (
                      <>
                        <EyeSlash size={14} aria-hidden="true" />
                        <span>Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Eye size={14} aria-hidden="true" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="inline-flex items-center gap-1 rounded-lg border border-fcit-navy/20 bg-fcit-cream px-2.5 py-1.5 caption-3 text-fcit-navyDeep hover:bg-fcit-lemonSoft"
                  >
                    <PencilSimple size={14} aria-hidden="true" />
                    <span>Edit</span>
                  </button>

                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      aria-label={`Delete ${item[titleField]}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-900/20 bg-[#F6E2E0] text-[#8C1D18] hover:bg-red-100"
                    >
                      <Trash size={14} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
