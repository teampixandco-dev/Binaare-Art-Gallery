"use client";
/* eslint-disable @next/next/no-img-element -- Admin previews use the original uploaded images. */
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Images,
  LayoutTemplate,
  LogOut,
  Plus,
  ShoppingBag,
  ExternalLink,
  Search,
  Upload,
  X,
  ArrowUp,
  ArrowDown,
  Trash2,
  AlertCircle,
  Sparkles,
  Download,
  FileText,
  FileSpreadsheet,
  FolderDown,
  Video,
  Shield,
  User,
  Star,
} from "lucide-react";
import type { BlogPost, MediaAsset, PageSection, ShopProduct, SiteContent, SitePage } from "@/lib/content-types";
import { pageHref } from "@/lib/content-types";

type Resource = "products" | "pages" | "posts" | "documents" | "media";
const CURRENT_USING_PAGE_SLUGS = ["home", "shop", "about", "artist", "exhibitions", "contact"];

type Editor =
  | { kind: "products"; value: ShopProduct }
  | { kind: "pages"; value: SitePage }
  | { kind: "posts"; value: BlogPost };

const tabs = [
  { id: "products", label: "Shop artworks", icon: ShoppingBag },
  { id: "pages", label: "Pages & header images", icon: LayoutTemplate },
  { id: "documents", label: "Download documents", icon: FolderDown },
  { id: "media", label: "Media library", icon: Images },
] as const;

const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const move = <T,>(items: T[], index: number, direction: number): T[] => {
  const next = [...items];
  const target = index + direction;
  if (target < 0 || target >= next.length) return items;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};

interface FieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  explanation?: string;
  badge?: string;
  error?: string;
}

function Field({
  id,
  label,
  value,
  onChange,
  area = false,
  required = false,
  type = "text",
  disabled = false,
  explanation,
  badge,
  error,
}: FieldProps) {
  const inputId = id || `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={`admin-field-group ${error ? "has-field-error" : ""}`}>
      <div className="admin-field-header">
        <label htmlFor={inputId} className="admin-field-label">
          {label}
        </label>
        <div className="admin-field-meta">
          {badge && <span className="admin-field-badge">{badge}</span>}
          {required && <span className="admin-required-badge">Required</span>}
        </div>
      </div>
      {explanation && <p className="admin-field-explanation">{explanation}</p>}
      <div className={`admin-input-wrap ${error ? "has-error" : ""}`}>
        {area ? (
          <textarea
            id={inputId}
            aria-label={label}
            aria-invalid={!!error}
            rows={label === "Article text" ? 14 : 4}
            disabled={disabled}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`admin-input ${error ? "input-error" : ""}`}
          />
        ) : (
          <input
            id={inputId}
            aria-label={label}
            aria-invalid={!!error}
            type={type}
            min={type === "number" ? 0 : undefined}
            step={type === "number" ? "0.01" : undefined}
            disabled={disabled}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`admin-input ${error ? "input-error" : ""}`}
          />
        )}
      </div>
      {error && (
        <div className="admin-validation-error" role="alert">
          <AlertCircle size={13} className="admin-validation-icon" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard({
  initial,
  username,
  role = "admin",
}: {
  initial: SiteContent;
  username: string;
  role?: "admin" | "editor";
}) {
  const [content, setContent] = useState(initial);
  const [tab, setTab] = useState<Resource>("products");
  const [editor, setEditor] = useState<Editor | null>(null);
  const [editorRevision, setEditorRevision] = useState(initial.revision);
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState("");
  const [working, setBusy] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const busy = working || !ready;
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [picker, setPicker] = useState<{ select: (src: string) => void } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const uploadInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (picker) dialog.current?.showModal();
    else dialog.current?.close();
  }, [picker]);

  if (role !== "admin" && tab === "pages") {
    setTab("products");
  }

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function request(action: string, body?: unknown) {
    const response = await fetch(`/api/admin/${action}`, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : {},
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
    const result = await response.json();
    if (response.status === 401) {
      throw new Error("Your session has expired. Open /admin in a new tab and sign in, then retry your save.");
    }
    if (!response.ok) throw new Error(result.error || "The request failed.");
    return result;
  }

  function report(err: unknown) {
    setError(err instanceof Error ? err.message : "Could not connect. Please try again.");
  }

  function canLeave() {
    return !dirty || window.confirm("Discard your unsaved changes?");
  }

  function open(next: Editor) {
    if (!canLeave()) return;
    setEditor(structuredClone(next));
    setEditorRevision(content.revision);
    setDirty(false);
    setFieldErrors({});
    setError("");
    setMessage("");
  }

  function change(value: Editor, clearErrorKey?: string) {
    setEditor(value);
    setDirty(true);
    setMessage("");
    if (clearErrorKey && fieldErrors[clearErrorKey]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[clearErrorKey];
        return next;
      });
    }
  }

  function validate(ed: Editor): Record<string, string> {
    const errors: Record<string, string> = {};
    const title = ed.value.title.trim();
    if (!title) {
      errors.title = "Title is required. Please provide a title.";
    }

    const slug = ed.value.slug.trim();
    if (!slug) {
      errors.slug = "URL name is required.";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      errors.slug = "Use lowercase letters, numbers, and hyphens only (e.g. studio-collection).";
    }

    if (ed.kind === "products") {
      if (!ed.value.medium.trim()) {
        errors.medium = "Artwork medium is required (e.g. Oil on Canvas).";
      }
      if (!ed.value.size.trim()) {
        errors.size = "Artwork dimensions are required (e.g. 50 × 70 cm).";
      }
      if (ed.value.price !== undefined && ed.value.price !== null && String(ed.value.price).trim() !== "") {
        const priceNum = Number(ed.value.price);
        if (isNaN(priceNum) || priceNum < 0) {
          errors.price = "Price must be a valid number of 0 or greater, or leave blank.";
        }
      }
    } else if (ed.kind === "posts") {
      if (!ed.value.date.trim()) {
        errors.date = "Publication date is required.";
      }
      if (!ed.value.excerpt.trim()) {
        errors.excerpt = "Short excerpt is required for preview cards.";
      }
      if (!ed.value.body.trim()) {
        errors.body = "Article text is required.";
      }
    } else if (ed.kind === "pages") {
      ed.value.sections.forEach(section => {
        if (!section.builtin && !section.title.trim()) {
          errors[`section-${section.id}-title`] = "Section heading cannot be empty.";
        }
      });
    }

    return errors;
  }

  function newEntry() {
    const id = crypto.randomUUID();
    setFieldErrors({});
    if (tab === "products") {
      open({
        kind: "products",
        value: {
          id,
          slug: "",
          title: "",
          category: "Oil Painting",
          medium: "",
          size: "",
          price: undefined,
          description: "",
          aboutPainting: "",
          artistMessage: "",
          closingQuote: "",
          materials: "",
          width: "",
          height: "",
          depth: "",
          frame: "",
          style: "",
          colours: "",
          theme: "",
          src: "",
          images: [],
          published: false,
        },
      });
    }
    if (tab === "posts") {
      open({
        kind: "posts",
        value: {
          id,
          slug: "",
          title: "",
          excerpt: "",
          body: "",
          cover: "",
          images: [],
          published: false,
          date: new Date().toISOString().slice(0, 10),
        },
      });
    }
    if (tab === "pages") {
      open({
        kind: "pages",
        value: {
          id,
          slug: "",
          title: "",
          subtitle: "",
          hero: "",
          body: "",
          builtin: false,
          published: false,
          showInNav: false,
          sections: [],
        },
      });
    }
  }

  async function save() {
    if (!editor) return;
    const errors = validate(editor);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please check the form and fix the highlighted fields below.");
      return;
    }

    setFieldErrors({});
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const next: SiteContent = await request("save", {
        revision: editorRevision,
        resource: editor.kind,
        value: editor.value,
      });
      setContent(next);
      setEditorRevision(next.revision);
      setDirty(false);
      setMessage(
        editor.value.published
          ? "Saved. Your changes are now visible on the website."
          : "Draft saved. It is hidden from the website."
      );
    } catch (err) {
      report(err);
    } finally {
      setBusy(false);
    }
  }

  async function remove(resource: Resource, id: string) {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const next = await request("delete", { revision: content.revision, resource, id });
      setContent(next);
      setEditor(null);
      setDirty(false);
      setFieldErrors({});
      setMessage("Item deleted.");
    } catch (err) {
      report(err);
    } finally {
      setBusy(false);
    }
  }

  async function upload(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setError("Images must be 10 MB or smaller.");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setContent(data.content);
      setEditorRevision(previous =>
        previous === data.content.revision - 1 ? data.content.revision : previous
      );
      if (picker) {
        picker.select(data.asset.src);
        setPicker(null);
      } else {
        setMessage("Image uploaded. Choose it in a product, post or page section to display it on the website.");
      }
    } catch (err) {
      report(err);
    } finally {
      setBusy(false);
      if (uploadInput.current) uploadInput.current.value = "";
    }
  }

  function imageField(label: string, src: string, select: (src: string) => void, explanation?: string) {
    return (
      <div className="admin-image-field">
        <div className="admin-field-header">
          <span className="admin-field-label">{label}</span>
          <span className="admin-field-badge">Cover Photo</span>
        </div>
        {explanation && <p className="admin-field-explanation">{explanation}</p>}
        <button
          type="button"
          className={`admin-image-select ${src ? "has-image" : ""}`}
          onClick={() => setPicker({ select })}
        >
          {src ? <img src={src} alt={label} /> : <Images size={28} />}
          <span>{src ? "Change image" : "Choose or upload image"}</span>
        </button>
      </div>
    );
  }

  function imageList(label: string, values: string[], select: (values: string[]) => void, explanation?: string) {
    return (
      <div className="admin-image-field">
        <div className="admin-row">
          <div>
            <div className="admin-field-header">
              <span className="admin-field-label">{label}</span>
              <span className="admin-field-badge">Gallery Strip</span>
            </div>
            {explanation && <p className="admin-field-explanation">{explanation}</p>}
          </div>
          <button
            type="button"
            className="admin-small"
            onClick={() => setPicker({ select: src => select([...values, src]) })}
          >
            <Plus size={14} /> Add image
          </button>
        </div>
        {values.length === 0 && (
          <p className="admin-muted admin-empty-inline">
            No images added yet. Click &quot;Add image&quot; to pick from your library or upload new photography.
          </p>
        )}
        <div className="admin-thumbnails">
          {values.map((src, index) => (
            <div key={`${src}-${index}`} className="admin-thumb-wrapper">
              {index === 0 && (
                <span className="admin-thumb-cover-tag" title="Primary cover photo shown in catalog">
                  Cover
                </span>
              )}
              <button
                type="button"
                className="admin-thumb"
                title={`Click to change image ${index + 1}`}
                onClick={() =>
                  setPicker({
                    select: nextSrc =>
                      select(values.map((value, i) => (i === index ? nextSrc : value))),
                  })
                }
              >
                <img src={src} alt={`${label} ${index + 1}`} />
              </button>
              <div className="admin-thumb-actions">
                {index > 0 && (
                  <button
                    type="button"
                    aria-label={`Make image ${index + 1} the primary cover photo`}
                    onClick={() => {
                      const item = values[index];
                      const rest = values.filter((_, i) => i !== index);
                      select([item, ...rest]);
                    }}
                    title="Set as Primary Cover Photo"
                  >
                    <Star size={13} />
                  </button>
                )}
                <button
                  type="button"
                  aria-label={`Move image ${index + 1} earlier`}
                  disabled={index === 0}
                  onClick={() => select(move(values, index, -1))}
                  title="Move earlier"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  aria-label={`Move image ${index + 1} later`}
                  disabled={index === values.length - 1}
                  onClick={() => select(move(values, index, 1))}
                  title="Move later"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() => select(values.filter((_, i) => i !== index))}
                  title="Remove image"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function pageSections(page: SitePage) {
    const setSections = (sections: PageSection[]) =>
      change({ kind: "pages", value: { ...page, sections } });

    return (
      <div className="admin-sections">
        <div className="admin-row">
          <div>
            <h3>Image sections</h3>
            <p className="admin-muted">
              Curate photo grids and thematic sections displayed on this page. Visitors can view, zoom, and filter these images.
            </p>
          </div>
          <button
            type="button"
            className="admin-small"
            onClick={() =>
              setSections([
                ...page.sections,
                { id: crypto.randomUUID(), title: "New image section", kind: "grid", builtin: false, items: [] },
              ])
            }
          >
            <Plus size={14} /> Add section
          </button>
        </div>

        {page.sections.map((section, si) => {
          const update = (next: PageSection) =>
            setSections(page.sections.map(s => (s.id === section.id ? next : s)));
          const sectionErrorKey = `section-${section.id}-title`;

          return (
            <section className="admin-section" key={section.id}>
              <div className="admin-row">
                <h4>{section.title}</h4>
                <div className="admin-actions">
                  <button
                    type="button"
                    aria-label={`Move section ${si + 1} earlier`}
                    disabled={si === 0}
                    onClick={() => setSections(move(page.sections, si, -1))}
                    title="Move section up"
                  >
                    <ArrowUp size={15} />
                  </button>
                  {!section.builtin && (
                    <button
                      type="button"
                      aria-label={`Remove section ${section.title}`}
                      onClick={() => setSections(page.sections.filter(s => s.id !== section.id))}
                      title="Delete section"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {!section.builtin && (
                <Field
                  label="Section heading"
                  badge="Section Title"
                  explanation="Heading displayed above this gallery collection on the public page."
                  required
                  error={fieldErrors[sectionErrorKey]}
                  value={section.title}
                  onChange={title => {
                    update({ ...section, title });
                    if (fieldErrors[sectionErrorKey]) {
                      setFieldErrors(prev => {
                        const n = { ...prev };
                        delete n[sectionErrorKey];
                        return n;
                      });
                    }
                  }}
                />
              )}

              {section.items.map((item, index) => (
                <div className="admin-section-item" key={item.id}>
                  {imageField(
                    `Section image ${index + 1}`,
                    item.src,
                    src => update({ ...section, items: section.items.map(i => (i.id === item.id ? { ...i, src } : i)) }),
                    "Photograph displayed in this section grid."
                  )}
                  <div>
                    <Field
                      id={`item-${item.id}-title`}
                      label="Image title / description for accessibility"
                      badge="Artwork Caption"
                      explanation="Artwork title shown when hovering, in the lightbox zoom, and for screen readers."
                      value={item.title}
                      onChange={title =>
                        update({ ...section, items: section.items.map(i => (i.id === item.id ? { ...i, title } : i)) })
                      }
                    />
                    {section.kind === "grid" && (
                      <Field
                        id={`item-${item.id}-desc`}
                        label="Caption"
                        badge="Editorial Story"
                        explanation="Curator notes or narrative shown below the artwork photo."
                        area
                        value={item.description}
                        onChange={description =>
                          update({
                            ...section,
                            items: section.items.map(i => (i.id === item.id ? { ...i, description } : i)),
                          })
                        }
                      />
                    )}
                    {section.kind === "grid" && (
                      <>
                        <Field
                          id={`item-${item.id}-cat`}
                          label="Medium / category"
                          badge="Filter Category"
                          explanation="Category filter tag used by visitors to group artworks (e.g. 'Studio collection', 'Oil on canvas')."
                          value={item.category}
                          onChange={category =>
                            update({
                              ...section,
                              items: section.items.map(i => (i.id === item.id ? { ...i, category } : i)),
                            })
                          }
                        />
                        <div className="admin-actions">
                          <button
                            type="button"
                            className="admin-small"
                            disabled={index === 0}
                            onClick={() => update({ ...section, items: move(section.items, index, -1) })}
                          >
                            Move up
                          </button>
                          <button
                            type="button"
                            className="admin-small"
                            disabled={index === section.items.length - 1}
                            onClick={() => update({ ...section, items: move(section.items, index, 1) })}
                          >
                            Move down
                          </button>
                          <button
                            type="button"
                            className="admin-small admin-danger"
                            onClick={() =>
                              update({ ...section, items: section.items.filter(i => i.id !== item.id) })
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {section.kind === "grid" && (
                <button
                  type="button"
                  className="admin-small"
                  onClick={() =>
                    setPicker({
                      select: src =>
                        update({
                          ...section,
                          items: [...section.items, { id: crypto.randomUUID(), title: "", description: "", category: "", src }],
                        }),
                    })
                  }
                >
                  <Plus size={14} /> Add image to this section
                </button>
              )}
            </section>
          );
        })}
      </div>
    );
  }

  const entries =
    tab === "pages"
      ? content.pages
          .filter(p => CURRENT_USING_PAGE_SLUGS.includes(p.slug))
          .filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()))
      : tab === "products"
      ? content.products.filter(p =>
          (p.title + " " + (p.medium || "") + " " + (p.category || "") + " " + (p.materials || "") + " " + (p.theme || "")).toLowerCase().includes(search.toLowerCase())
        )
      : tab === "media"
      ? content.media.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
      : [];
  const href = editor
    ? editor.kind === "pages"
      ? pageHref(editor.value)
      : editor.kind === "posts"
      ? `/blog/${editor.value.slug}`
      : `/shop/${editor.value.slug}`
    : "";

  const visibleTabs = tabs.filter(t => role === "admin" || t.id !== "pages");

  return (
    <main className="admin-root admin-dashboard">
      <aside className="admin-sidebar">
        <a href="/admin" className="admin-wordmark">
          Binaare<span>GALLERY STUDIO</span>
        </a>
        <p className="admin-nav-caption">Manage your website</p>
        <nav>
          {visibleTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              disabled={busy}
              className={tab === id ? "active" : ""}
              onClick={() => {
                if (!canLeave()) return;
                setTab(id);
                setSearch("");
                setEditor(null);
                setDirty(false);
                setFieldErrors({});
                setMessage("");
                setError("");
              }}
            >
              <Icon size={18} />
              {label}
              <span>
                {id === "documents"
                  ? (role === "admin" ? 3 : 2)
                  : id === "pages"
                  ? content.pages.filter(p => CURRENT_USING_PAGE_SLUGS.includes(p.slug)).length
                  : content[id]?.length || 0}
              </span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-user-badge">
            <div className="admin-user-avatar">
              {role === "admin" ? <Shield size={15} /> : <User size={15} />}
            </div>
            <div className="admin-user-meta">
              <span className="admin-user-name">{username}</span>
              <span className={`admin-user-pill ${role === "admin" ? "admin-pill-admin" : "admin-pill-editor"}`}>
                {role === "admin" ? "Site Designer / Admin" : "Art Curator / Shop Editor"}
              </span>
            </div>
          </div>
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink size={15} /> View live gallery
          </a>
          <button
            disabled={busy}
            onClick={async () => {
              if (!canLeave()) return;
              try {
                await request("logout", {});
                window.location.assign("/admin");
              } catch (err) {
                report(err);
              }
            }}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">
              <Sparkles size={12} /> Curator Space
            </p>
            <h1>{tabs.find(t => t.id === tab)?.label}</h1>
            <p className="admin-muted">
              {tab === "products"
                ? "Manage your original artwork portfolio, high-resolution photography, specifications, and shop availability."
                : tab === "pages"
                ? "Replace hero header images and customize image sections for the active pages on the website."
                : tab === "documents"
                ? "Download technical specifications, architecture blueprints, artwork inventory catalogs, and site backups."
                : "Central image vault. Upload high-resolution photography ready for public display."}
            </p>
          </div>
          {tab === "products" && (
            <button
              className="admin-primary"
              disabled={busy}
              onClick={() => newEntry()}
            >
              <Plus size={16} /> Add artwork
            </button>
          )}
          {tab === "media" && (
            <button
              className="admin-primary"
              disabled={busy}
              onClick={() => uploadInput.current?.click()}
            >
              <Upload size={16} /> Upload image
            </button>
          )}
        </header>

        <input
          ref={uploadInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          hidden
          onChange={e => {
            if (e.target.files?.[0]) void upload(e.target.files[0]);
          }}
        />

        {error && (
          <div className="admin-error" role="alert">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button
              disabled={busy}
              className="admin-small"
              onClick={async () => {
                if (!canLeave()) return;
                try {
                  const next = await request("content");
                  setContent(next);
                  setEditor(null);
                  setDirty(false);
                  setFieldErrors({});
                  setError("");
                } catch (err) {
                  report(err);
                }
              }}
            >
              Reload latest content
            </button>
          </div>
        )}

        {message && (
          <div className="admin-success" role="status">
            {message}
          </div>
        )}

        {busy && (
          <p className="admin-muted" role="status" style={{ fontStyle: "italic" }}>
            Processing changes…
          </p>
        )}

        {tab === "documents" ? (
          <div className="admin-doc-center">
            <div className="admin-doc-grid">
              {/* Card 1: Technical Specification & Architecture Manual */}
              <div className="admin-doc-card">
                <div>
                  <div className="admin-doc-header">
                    <div className="admin-doc-icon">
                      <FileText size={24} />
                    </div>
                    <div className="admin-doc-info">
                      <h3>Technical Specification &amp; Architecture Manual</h3>
                      <p>
                        11-page Master Edition with Vector Blueprints, system diagram, Next.js deployment topology, database schemas, and performance benchmarks.
                      </p>
                    </div>
                  </div>
                  <div className="admin-doc-meta">
                    <span><strong>Format:</strong> Adobe PDF</span>
                    <span>•</span>
                    <span><strong>Pages:</strong> 11 Pages</span>
                    <span>•</span>
                    <span><strong>Size:</strong> ~266 KB</span>
                  </div>
                </div>
                <div className="admin-doc-actions">
                  <a
                    href="/documents/Binaare-Art-Gallery-Technical-Specification.pdf"
                    download="Binaare-Art-Gallery-Technical-Specification.pdf"
                    className="admin-primary"
                  >
                    <Download size={14} /> Download PDF
                  </a>
                  <a
                    href="/documents/Binaare-Art-Gallery-Technical-Specification.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="admin-small"
                  >
                    <ExternalLink size={14} /> View in Browser
                  </a>
                  {role === "admin" && (
                    <button
                      type="button"
                      disabled={busy}
                      className="admin-small"
                      onClick={async () => {
                        setBusy(true);
                        setError("");
                        setMessage("");
                        try {
                          await request("generate-pdf", {});
                          setMessage("Technical Specification PDF compiled and updated successfully!");
                        } catch (e) {
                          report(e);
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      <Sparkles size={14} /> Re-compile PDF
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Artwork Catalog & Inventory Data */}
              <div className="admin-doc-card">
                <div>
                  <div className="admin-doc-header">
                    <div className="admin-doc-icon">
                      <FileSpreadsheet size={24} />
                    </div>
                    <div className="admin-doc-info">
                      <h3>Artwork Inventory &amp; Catalog Report</h3>
                      <p>
                        Complete artwork portfolio export containing all original pieces, prices, mediums, dimensions, materials, styles, themes, and photography links.
                      </p>
                    </div>
                  </div>
                  <div className="admin-doc-meta">
                    <span><strong>Total Artworks:</strong> {content.products.length} Items</span>
                    <span>•</span>
                    <span><strong>Published:</strong> {content.products.filter(p => p.published).length} Live</span>
                  </div>
                </div>
                <div className="admin-doc-actions">
                  <a
                    href="/api/admin/catalog-csv"
                    download="binaare-artworks-catalog.csv"
                    className="admin-primary"
                  >
                    <Download size={14} /> Download CSV (Excel)
                  </a>
                  <button
                    type="button"
                    className="admin-small"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(content.products, null, 2)], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `binaare-artworks-catalog-${new Date().toISOString().slice(0, 10)}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download size={14} /> Download JSON
                  </button>
                </div>
              </div>

              {/* Card 3: Site Content & Pages Backup (Admin Only) */}
              {role === "admin" && (
                <div className="admin-doc-card">
                  <div>
                    <div className="admin-doc-header">
                      <div className="admin-doc-icon">
                        <FolderDown size={24} />
                      </div>
                      <div className="admin-doc-info">
                        <h3>Gallery Content &amp; Pages Backup</h3>
                        <p>
                          Full system snapshot of all active pages, header image replacements, curated image grids, and studio configurations.
                        </p>
                      </div>
                    </div>
                    <div className="admin-doc-meta">
                      <span><strong>Revision:</strong> v{content.revision}</span>
                      <span>•</span>
                      <span><strong>Pages:</strong> {content.pages.filter(p => CURRENT_USING_PAGE_SLUGS.includes(p.slug)).length} Active</span>
                      <span>•</span>
                      <span><strong>Media Assets:</strong> {content.media.length} Uploads</span>
                    </div>
                  </div>
                  <div className="admin-doc-actions">
                    <a
                      href="/api/admin/backup"
                      download={`binaare-site-backup-${new Date().toISOString().slice(0, 10)}.json`}
                      className="admin-primary"
                    >
                      <Download size={14} /> Download Site Backup (JSON)
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`admin-content ${editor ? "editing" : ""}`}>
            <section className="admin-list">
              <div className="admin-search">
                <Search size={16} color="var(--admin-ink-light)" />
                <input
                  placeholder={`Search ${tab === "media" ? "images" : tab}…`}
                  aria-label="Search content"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {entries.length === 0 && (
                <p className="admin-muted admin-empty-inline">
                  No {tab === "media" ? "images" : tab} found. Click above to add your first item.
                </p>
              )}

              <div className={tab === "media" || !editor ? "admin-cards" : "admin-list-rows"}>
                {entries.map(item => {
                  if (tab === "media") {
                    const media = item as MediaAsset;
                    return (
                      <article className="admin-media-card" key={media.id}>
                        <img src={media.src} alt={media.name} />
                        <strong>{media.name}</strong>
                        <p>
                          {media.width} × {media.height} px
                        </p>
                        <button
                          disabled={busy}
                          className="admin-small admin-danger"
                          onClick={() => remove("media", media.id)}
                        >
                          Delete image
                        </button>
                      </article>
                    );
                  }

                  const value = item as ShopProduct | SitePage | BlogPost;
                  const isVideoHero = "hero" in value && Boolean(value.hero?.endsWith(".mp4"));
                  const src =
                    "src" in value
                      ? value.src
                      : "hero" in value
                      ? isVideoHero
                        ? "/artworks/together-we-bloom.webp"
                        : value.hero || "/artworks/together-we-bloom.webp"
                      : value.cover;

                  return (
                    <button
                      key={item.id}
                      className={`admin-content-card ${editor?.value.id === item.id ? "selected" : ""}`}
                      disabled={busy}
                      onClick={() => open({ kind: tab as "products" | "pages" | "posts", value } as Editor)}
                    >
                      <div className="admin-card-media-wrapper">
                        <img src={src} alt="" />
                        {isVideoHero && (
                          <span className="admin-card-video-pill">
                            <Video size={10} /> Ambient Video
                          </span>
                        )}
                      </div>
                      <div>
                        <span className={`admin-badge ${value.published ? "published" : ""}`}>
                          {value.published ? "Published" : "Draft"}
                        </span>
                        <h3>{value.title}</h3>
                        <p>
                          {"medium" in value
                            ? (value.category ? `${value.category} • ` : "") + (value.medium || value.size)
                            : "sections" in value
                            ? `Header: ${isVideoHero ? "Ambient Video" : "Custom Photo"} • ${value.sections.length} sections`
                            : value.date}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

          {editor && (
            <form
              className="admin-editor"
              noValidate
              onSubmit={e => {
                e.preventDefault();
                void save();
              }}
            >
              <div className="admin-editor-heading">
                <div>
                  <p className="admin-eyebrow">
                    {content[editor.kind].some(i => i.id === editor.value.id) ? "EDITING" : "NEW ENTRY"}
                  </p>
                  <h2>{editor.value.title || "Untitled"}</h2>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  aria-label="Close editor"
                  onClick={() => {
                    if (canLeave()) {
                      setEditor(null);
                      setDirty(false);
                      setFieldErrors({});
                    }
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <fieldset disabled={busy}>
                <Field
                  label="Title"
                  badge={editor.kind === "products" ? "Artwork Name" : editor.kind === "pages" ? "Page Headline" : "Article Title"}
                  explanation={
                    editor.kind === "products"
                      ? "Public artwork title displayed in the shop catalog, artwork detail page, and cart."
                      : editor.kind === "pages"
                      ? "Primary title displayed in the page hero header, browser tab, and navigation."
                      : "Headline of the journal post displayed on the blog list and article header."
                  }
                  required
                  error={fieldErrors.title}
                  value={editor.value.title}
                  onChange={title => {
                    const shouldSyncSlug =
                      editor.kind !== "pages" ||
                      (!editor.value.builtin &&
                        (editor.value.slug === "" || editor.value.slug === slugify(editor.value.title)));
                    change(
                      {
                        ...editor,
                        value: {
                          ...editor.value,
                          title,
                          slug: shouldSyncSlug ? slugify(title) : editor.value.slug,
                        },
                      } as Editor,
                      "title"
                    );
                  }}
                />

                <Field
                  label="URL name"
                  badge={editor.kind === "pages" && editor.value.builtin ? "Fixed Route" : "Web Path"}
                  explanation={
                    editor.kind === "pages" && editor.value.builtin
                      ? "This is a core system page with a reserved URL route."
                      : "The unique web address slug where visitors access this item on the site."
                  }
                  required
                  disabled={editor.kind === "pages" && editor.value.builtin}
                  error={fieldErrors.slug}
                  value={editor.value.slug}
                  onChange={slug =>
                    change(
                      {
                        ...editor,
                        value: { ...editor.value, slug },
                      } as Editor,
                      "slug"
                    )
                  }
                />
                <p className="admin-help">{href}</p>

                {editor.kind === "products" && (
                  <>
                    <div className="admin-spec-group">
                      <div className="admin-spec-header">
                        <h4>Artwork Photography &amp; Images</h4>
                        <span
                          className="admin-field-badge"
                          style={{
                            background:
                              (editor.value.images || []).length > 1
                                ? "rgba(140, 112, 79, 0.15)"
                                : "rgba(0, 0, 0, 0.05)",
                            color:
                              (editor.value.images || []).length > 1
                                ? "#8c704f"
                                : "#57534e",
                            fontWeight: 600,
                          }}
                        >
                          {(editor.value.images || []).length > 1
                            ? `Detailed Gallery Mode (${(editor.value.images || []).length} images)`
                            : (editor.value.images || []).length === 1 || editor.value.src
                            ? "Single Image Mode (1 image)"
                            : "No Images"}
                        </span>
                      </div>

                      <div
                        style={{
                          background: "#faf8f5",
                          border: "1px solid #ebd7b5",
                          borderRadius: "8px",
                          padding: "10px 14px",
                          marginBottom: "16px",
                          fontSize: "12.5px",
                          lineHeight: 1.5,
                          color: "#6b5d4d",
                        }}
                      >
                        <strong>Artwork Display Rule:</strong>
                        <ul style={{ margin: "4px 0 0", paddingLeft: "18px", listStyleType: "disc" }}>
                          <li><strong>1 image:</strong> Product page displays a clean, focused single artwork view without thumbnail bars.</li>
                          <li><strong>2+ images:</strong> Product page automatically displays the interactive detailed view with thumbnail gallery strip, arrows, and zoom inspection.</li>
                        </ul>
                      </div>

                      {imageField(
                        "Primary Cover Image",
                        editor.value.src,
                        src => {
                          const existingImages = (editor.value.images || []).filter(s => s !== src);
                          const nextImages = [src, ...existingImages];
                          change({ kind: "products", value: { ...editor.value, src, images: nextImages } });
                        },
                        "Main photograph shown in the shop catalog, cart, and default artwork view."
                      )}
                      {imageList(
                        "Artwork Gallery Photography & Detailed Views",
                        editor.value.images && editor.value.images.length > 0
                          ? editor.value.images
                          : editor.value.src
                          ? [editor.value.src]
                          : [],
                        images => {
                          const primarySrc = images[0] || "";
                          change({
                            kind: "products",
                            value: {
                              ...editor.value,
                              images,
                              src: primarySrc,
                            },
                          });
                        },
                        "Add additional angled views, texture close-ups, room mockups, or framed photography. The first image is always the primary cover photo."
                      )}
                    </div>

                    <div className="admin-spec-group">
                      <div className="admin-spec-header">
                        <h4>Artwork Overview</h4>
                        <span className="admin-field-badge">Basic Details</span>
                      </div>
                      <div className="admin-two">
                        <Field
                          label="Category"
                          badge="Collection"
                          explanation="Artwork category (e.g. Oil Painting, Mixed Media, Acrylic, Texture, Water color)."
                          value={editor.value.category || ""}
                          onChange={category => change({ kind: "products", value: { ...editor.value, category } })}
                        />
                        <Field
                          label="Price (USD)"
                          badge="Optional"
                          explanation="Artwork listing price in USD. Optional — leave empty or 0 to display 'Price Upon Request' and inquiry contact instead."
                          type="number"
                          error={fieldErrors.price}
                          value={
                            editor.value.price === undefined || editor.value.price === null || editor.value.price === 0
                              ? ""
                              : String(editor.value.price)
                          }
                          onChange={price => {
                            const trimmed = price.trim();
                            const num = trimmed === "" ? undefined : Number(trimmed);
                            change(
                              { kind: "products", value: { ...editor.value, price: num === undefined || isNaN(num) ? undefined : num } },
                              "price"
                            );
                          }}
                        />
                      </div>
                    </div>

                    <div className="admin-spec-group">
                      <div className="admin-spec-header">
                        <h4>Dimensions &amp; Specifications</h4>
                        <span className="admin-field-badge">Technical Details</span>
                      </div>
                      <div className="admin-two">
                        <Field
                          label="Medium"
                          badge="Technique & Surface"
                          explanation="Medium used (e.g. Original Floral Garden Oil Painting on Canvas)."
                          required
                          error={fieldErrors.medium}
                          value={editor.value.medium}
                          onChange={medium =>
                            change(
                              { kind: "products", value: { ...editor.value, medium } },
                              "medium"
                            )
                          }
                        />
                        <Field
                          label="Size / Dimensions"
                          badge="Display Size"
                          explanation="Measurements with units (e.g. 15 × 19 inches, 28 × 20 inches)."
                          required
                          error={fieldErrors.size}
                          value={editor.value.size}
                          onChange={size =>
                            change(
                              { kind: "products", value: { ...editor.value, size } },
                              "size"
                            )
                          }
                        />
                      </div>
                      <div className="admin-two">
                        <Field
                          label="Width"
                          badge="Width Dimension"
                          explanation="Width with unit (e.g. 15 inches, 28 inches)."
                          value={editor.value.width || ""}
                          onChange={width => change({ kind: "products", value: { ...editor.value, width } })}
                        />
                        <Field
                          label="Height"
                          badge="Height Dimension"
                          explanation="Height with unit (e.g. 19 inches, 20 inches)."
                          value={editor.value.height || ""}
                          onChange={height => change({ kind: "products", value: { ...editor.value, height } })}
                        />
                      </div>
                      <div className="admin-two">
                        <Field
                          label="Depth"
                          badge="Canvas Depth"
                          explanation="Depth / thickness (e.g. 1.5 inches, 1 inch)."
                          value={editor.value.depth || ""}
                          onChange={depth => change({ kind: "products", value: { ...editor.value, depth } })}
                        />
                        <Field
                          label="Style & Movement"
                          badge="Style"
                          explanation="Artistic style (e.g. Contemporary Expressive Floral and Botanical Art)."
                          value={editor.value.style || ""}
                          onChange={style => change({ kind: "products", value: { ...editor.value, style } })}
                        />
                      </div>
                      <Field
                        label="Materials"
                        badge="Physical Materials"
                        explanation="Exact materials used (e.g. Original oil painting on canvas with glass beads)."
                        value={editor.value.materials || ""}
                        onChange={materials => change({ kind: "products", value: { ...editor.value, materials } })}
                      />
                      <Field
                        label="Frame Specification"
                        badge="Framing Details"
                        explanation="Frame description (e.g. Framed in an elegant dark wood frame with subtle antique gold detailing)."
                        value={editor.value.frame || ""}
                        onChange={frame => change({ kind: "products", value: { ...editor.value, frame } })}
                      />
                      <Field
                        label="Colours Palette"
                        badge="Colour Harmony"
                        explanation="Colours used (e.g. Cream, Blush Pink, Deep Rose, Burgundy, Warm Gold, Green)."
                        value={editor.value.colours || ""}
                        onChange={colours => change({ kind: "products", value: { ...editor.value, colours } })}
                      />
                      <Field
                        label="Theme & Concept"
                        badge="Thematic Focus"
                        explanation="Theme of this piece (e.g. Love, Friendship, Togetherness, Individuality and Personal Growth)."
                        value={editor.value.theme || ""}
                        onChange={theme => change({ kind: "products", value: { ...editor.value, theme } })}
                      />
                    </div>

                    <div className="admin-spec-group">
                      <div className="admin-spec-header">
                        <h4>Content Blocks &amp; Descriptions</h4>
                        <span className="admin-field-badge">Narrative & Philosophy</span>
                      </div>
                      <Field
                        label="Artwork Description (Markdown supported)"
                        badge="Editorial Story"
                        explanation="Main narrative describing the artwork's symbolism, composition, and feeling. Use **bold** and *italic* for formatting."
                        area
                        value={editor.value.description}
                        onChange={description =>
                          change({ kind: "products", value: { ...editor.value, description } })
                        }
                      />
                      <Field
                        label="About This Painting (Extended Narrative)"
                        badge="In-depth Reflection"
                        explanation="Optional supplementary background or technique details."
                        area
                        value={editor.value.aboutPainting || ""}
                        onChange={aboutPainting =>
                          change({ kind: "products", value: { ...editor.value, aboutPainting } })
                        }
                      />
                      <Field
                        label="Artist Note / Message"
                        badge="Curator Statement"
                        explanation="Personal message from the artist featured in the callout box on the artwork detail page."
                        area
                        value={editor.value.artistMessage || ""}
                        onChange={artistMessage =>
                          change({ kind: "products", value: { ...editor.value, artistMessage } })
                        }
                      />
                      <Field
                        label="Inspiration & Reflection Quote"
                        badge="Closing Quote"
                        explanation="Poetic quote featured prominently at the end of the artwork showcase."
                        area
                        value={editor.value.closingQuote || ""}
                        onChange={closingQuote =>
                          change({ kind: "products", value: { ...editor.value, closingQuote } })
                        }
                      />
                    </div>
                  </>
                )}

                {editor.kind === "posts" && (
                  <>
                    <Field
                      label="Publication date"
                      badge="Timeline"
                      explanation="Date shown on the post and used for chronological ordering in the journal."
                      required
                      type="date"
                      error={fieldErrors.date}
                      value={editor.value.date}
                      onChange={date =>
                        change({ kind: "posts", value: { ...editor.value, date } }, "date")
                      }
                    />
                    <Field
                      label="Short excerpt"
                      badge="Preview Summary"
                      explanation="Teaser summary displayed on blog index cards and social previews."
                      required
                      area
                      error={fieldErrors.excerpt}
                      value={editor.value.excerpt}
                      onChange={excerpt =>
                        change({ kind: "posts", value: { ...editor.value, excerpt } }, "excerpt")
                      }
                    />
                    {imageField(
                      "Blog cover image",
                      editor.value.cover,
                      cover => change({ kind: "posts", value: { ...editor.value, cover } }),
                      "Primary hero photograph displayed at the top of the article and on the blog card."
                    )}
                    <Field
                      label="Article text"
                      badge="Story Content"
                      explanation="Full article text in plain format. Line breaks and blank lines create clean paragraphs automatically."
                      required
                      area
                      error={fieldErrors.body}
                      value={editor.value.body}
                      onChange={body =>
                        change({ kind: "posts", value: { ...editor.value, body } }, "body")
                      }
                    />
                    {imageList(
                      "Article photographs",
                      editor.value.images,
                      images => change({ kind: "posts", value: { ...editor.value, images } }),
                      "Additional photography displayed within the inline gallery of this journal entry."
                    )}
                  </>
                )}

                {editor.kind === "pages" && (
                  <>
                    <div className="admin-spec-group">
                      <div className="admin-spec-header">
                        <h4>Header Image Replacement</h4>
                        <span className="admin-field-badge">Hero Banner</span>
                      </div>
                      <p className="admin-muted" style={{ marginBottom: "12px" }}>
                        Replace the full-width hero header image or video displayed at the top of the {editor.value.title} page.
                      </p>

                      {/* Header Preview */}
                      <div className="admin-hero-preview">
                        <span className="admin-hero-badge">
                          {editor.value.hero?.endsWith(".mp4") ? "Ambient Video" : "Header Image"}
                        </span>
                        {editor.value.hero?.endsWith(".mp4") ? (
                          <video src={editor.value.hero} autoPlay muted loop playsInline />
                        ) : (
                          <img src={editor.value.hero || "/artworks/together-we-bloom.webp"} alt={editor.value.title} />
                        )}
                      </div>

                      {imageField(
                        editor.value.slug === "home"
                          ? "Hero header photo (or uploaded video)"
                          : `${editor.value.title} hero header image`,
                        editor.value.hero,
                        hero => change({ kind: "pages", value: { ...editor.value, hero } }),
                        editor.value.slug === "home"
                          ? "Choose a photograph from your library to replace the homepage video, or choose another video."
                          : "Primary banner photograph displayed across the top of this page."
                      )}

                      {editor.value.slug === "home" && (
                        <button
                          type="button"
                          className="admin-small"
                          style={{ marginBottom: "18px", marginTop: "8px" }}
                          onClick={() =>
                            change({ kind: "pages", value: { ...editor.value, hero: "/hero-video.mp4" } })
                          }
                        >
                          Restore original ambient video (/hero-video.mp4)
                        </button>
                      )}
                    </div>

                    <div className="admin-spec-group">
                      <div className="admin-spec-header">
                        <h4>Header Typography &amp; Narrative</h4>
                        <span className="admin-field-badge">Page Text</span>
                      </div>
                      <Field
                        label="Subtitle"
                        badge="Hero Subtitle"
                        explanation="Secondary tagline displayed gracefully beneath the main title in the hero banner."
                        value={editor.value.subtitle}
                        onChange={subtitle =>
                          change({ kind: "pages", value: { ...editor.value, subtitle } })
                        }
                      />
                      <Field
                        label={editor.value.builtin ? "Additional page text" : "Page text"}
                        badge="Narrative"
                        explanation={
                          editor.value.builtin
                            ? "Optional editorial narrative displayed in the story section below the main hero."
                            : "Primary editorial text and artist statement displayed on this page."
                        }
                        area
                        value={editor.value.body}
                        onChange={body => change({ kind: "pages", value: { ...editor.value, body } })}
                      />
                    </div>

                    <div className="admin-spec-group">
                      <div className="admin-spec-header">
                        <h4>Page Image Sections &amp; Galleries</h4>
                        <span className="admin-field-badge">Curated Grids</span>
                      </div>
                      {pageSections(editor.value)}
                    </div>

                    {!editor.value.builtin && (
                      <label className="admin-check">
                        <input
                          type="checkbox"
                          checked={editor.value.showInNav}
                          onChange={e =>
                            change({ kind: "pages", value: { ...editor.value, showInNav: e.target.checked } })
                          }
                        />
                        Show in website navigation
                      </label>
                    )}
                  </>
                )}

                {!(editor.kind === "pages" && editor.value.builtin) && (
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={editor.value.published}
                      onChange={e =>
                        change({
                          ...editor,
                          value: { ...editor.value, published: e.target.checked },
                        } as Editor)
                      }
                    />
                    Published — visible on the website after saving
                  </label>
                )}

                <div className="admin-savebar">
                  <button className="admin-primary" type="submit">
                    {busy ? "Saving…" : editor.value.published ? "Save & publish" : "Save draft"}
                  </button>
                  {!dirty && editor.value.published && content[editor.kind].some(i => i.id === editor.value.id) && (
                    <a href={href} target="_blank" rel="noreferrer" className="admin-small">
                      View page <ExternalLink size={14} />
                    </a>
                  )}
                  {dirty && <span className="admin-help" style={{ margin: 0 }}>Unsaved changes</span>}
                  {!(editor.kind === "pages" && editor.value.builtin) &&
                    content[editor.kind].some(i => i.id === editor.value.id) && (
                      <button
                        type="button"
                        className="admin-small admin-danger"
                        style={{ marginLeft: "auto" }}
                        onClick={() => remove(editor.kind, editor.value.id)}
                      >
                        Delete
                      </button>
                    )}
                </div>
              </fieldset>
            </form>
          )}
        </div>
      )}

        <footer className="admin-studio-footer">
          <div className="admin-footer-brand">
            <span className="admin-footer-title">BINAARE ART GALLERY</span>
            <span className="admin-footer-dot">•</span>
            <span className="admin-footer-sub">Fine Art Curator &amp; Management Studio</span>
          </div>
          <div className="admin-footer-credits">
            <span>Designed &amp; Engineered by <strong>PIXANDCO</strong></span>
          </div>
        </footer>
      </div>

      <dialog
        ref={dialog}
        className="admin-root admin-picker"
        onCancel={e => {
          if (busy) e.preventDefault();
          else setPicker(null);
        }}
      >
        <header className="admin-row">
          <div>
            <h2>Choose an image</h2>
            <p className="admin-muted">JPG, PNG, WebP or AVIF. Up to 10 MB.</p>
          </div>
          <button
            type="button"
            disabled={busy}
            aria-label="Close image library"
            onClick={() => setPicker(null)}
          >
            <X size={21} />
          </button>
        </header>

        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="admin-primary"
          disabled={busy}
          onClick={() => uploadInput.current?.click()}
        >
          <Upload size={16} />
          {busy ? "Uploading…" : "Upload & use image"}
        </button>

        {!content.media.length && (
          <p className="admin-empty-inline admin-muted">Your media library is empty. Upload your first image above.</p>
        )}

        <div className="admin-picker-grid">
          {content.media.map(asset => (
            <button
              type="button"
              disabled={busy}
              key={asset.id}
              onClick={() => {
                picker?.select(asset.src);
                setPicker(null);
              }}
            >
              <img src={asset.src} alt={asset.name} />
              <span>{asset.name}</span>
            </button>
          ))}
        </div>
      </dialog>
    </main>
  );
}
