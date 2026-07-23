import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ContentRecord, ContentDraft, CollectionRec, ContentComment, ContentStatus, Visibility } from '../content/types'
import { seedContent, seedCollections, seedComments, buildRecord } from '../content/mockContent'
import { demoUser } from '../demo/demoData'

const KREC = 'iica_content_records_v1'
const KCOL = 'iica_content_collections_v1'
const KCMT = 'iica_content_comments_v1'
const KDRAFT = 'iica_content_draft_v1'

function load<T>(k: string, fb: T): T {
  try { const r = localStorage.getItem(k); if (r) return JSON.parse(r) as T } catch { /* */ }
  return fb
}
const rid = (p: string) => p + Math.random().toString(36).slice(2, 9)
const today = () => new Date().toISOString().slice(0, 10)

interface Ctx {
  records: ContentRecord[]
  collections: CollectionRec[]
  comments: ContentComment[]
  draft: ContentDraft
  getRecord: (id?: string) => ContentRecord | undefined
  myContent: () => ContentRecord[]
  publicContent: () => ContentRecord[]
  // draft
  saveDraft: (patch: ContentDraft) => void
  resetDraft: (patch?: ContentDraft) => void
  loadDraftFrom: (r: ContentRecord) => void
  publish: (status: ContentStatus) => ContentRecord
  publishRecords: (items: ContentDraft[], status: ContentStatus) => ContentRecord[]
  // records
  updateRecord: (id: string, patch: Partial<ContentRecord>) => void
  archiveRecord: (id: string) => void
  deleteRecord: (id: string) => void
  incrementView: (id: string) => void
  registerShare: (id: string) => void
  registerDownload: (id: string) => void
  // collections
  createCollection: (c: Omit<CollectionRec, 'id' | 'createdByMe'>) => CollectionRec
  updateCollection: (id: string, patch: Partial<CollectionRec>) => void
  deleteCollection: (id: string) => void
  setCollection: (contentId: string, collectionId: string | null) => void
  collectionContent: (id: string) => ContentRecord[]
  // comments
  contentComments: (id: string) => ContentComment[]
  addComment: (contentId: string, text: string, parentId?: string | null) => void
  deleteComment: (id: string) => void
  toggleCommentLike: (id: string) => void
  reportComment: (id: string) => void
}

const ContentContext = createContext<Ctx | null>(null)

export function ContentProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<ContentRecord[]>(() => load(KREC, seedContent))
  const [collections, setCollections] = useState<CollectionRec[]>(() => load(KCOL, seedCollections))
  const [comments, setComments] = useState<ContentComment[]>(() => load(KCMT, seedComments))
  const [likedComments, setLikedComments] = useState<string[]>([])
  const [draft, setDraft] = useState<ContentDraft>(() => load(KDRAFT, {}))

  useEffect(() => { try { localStorage.setItem(KREC, JSON.stringify(records)) } catch { /* */ } }, [records])
  useEffect(() => { try { localStorage.setItem(KCOL, JSON.stringify(collections)) } catch { /* */ } }, [collections])
  useEffect(() => { try { localStorage.setItem(KCMT, JSON.stringify(comments)) } catch { /* */ } }, [comments])
  useEffect(() => { try { localStorage.setItem(KDRAFT, JSON.stringify(draft)) } catch { /* */ } }, [draft])

  const getRecord = useCallback((id?: string) => records.find((r) => r.id === id), [records])
  const myContent = useCallback(() => records.filter((r) => r.createdByMe), [records])
  const publicContent = useCallback(
    () => records.filter((r) => r.status === 'published' && (r.visibility === 'Public' || r.visibility === 'Members Only')),
    [records],
  )

  const saveDraft = useCallback((patch: ContentDraft) => setDraft((d) => ({ ...d, ...patch })), [])
  const resetDraft = useCallback((patch: ContentDraft = {}) => setDraft(patch), [])
  const loadDraftFrom = useCallback((r: ContentRecord) => setDraft({ ...r }), [])

  const publish = useCallback((status: ContentStatus): ContentRecord => {
    const id = draft.id ?? rid('ct-')
    const existing = draft.id
    const rec = buildRecord(draft, id, {
      status,
      visibility: status === 'draft' ? 'Draft' : (draft.visibility ?? 'Public'),
      date: today(),
    })
    setRecords((list) => (existing && list.some((x) => x.id === id))
      ? list.map((x) => (x.id === id ? { ...x, ...rec } : x))
      : [rec, ...list])
    setDraft({})
    return rec
  }, [draft])

  const publishRecords = useCallback((items: ContentDraft[], status: ContentStatus): ContentRecord[] => {
    const recs = items.map((d) => buildRecord(d, rid('ct-'), {
      status, visibility: status === 'draft' ? 'Draft' : (d.visibility ?? 'Public'), date: today(),
    }))
    setRecords((list) => [...recs, ...list])
    return recs
  }, [])

  const updateRecord = useCallback((id: string, patch: Partial<ContentRecord>) =>
    setRecords((l) => l.map((r) => (r.id === id ? { ...r, ...patch, date: today() } : r))), [])
  const archiveRecord = useCallback((id: string) =>
    setRecords((l) => l.map((r) => (r.id === id ? { ...r, status: 'archived' as ContentStatus } : r))), [])
  const deleteRecord = useCallback((id: string) => setRecords((l) => l.filter((r) => r.id !== id)), [])
  const incrementView = useCallback((id: string) =>
    setRecords((l) => l.map((r) => (r.id === id ? { ...r, views: r.views + 1 } : r))), [])
  const registerShare = useCallback((id: string) =>
    setRecords((l) => l.map((r) => (r.id === id ? { ...r, shares: r.shares + 1 } : r))), [])
  const registerDownload = useCallback((id: string) =>
    setRecords((l) => l.map((r) => (r.id === id ? { ...r, downloads: r.downloads + 1 } : r))), [])

  const createCollection = useCallback((c: Omit<CollectionRec, 'id' | 'createdByMe'>): CollectionRec => {
    const col: CollectionRec = { ...c, id: rid('col-'), createdByMe: true }
    setCollections((l) => [col, ...l])
    return col
  }, [])
  const updateCollection = useCallback((id: string, patch: Partial<CollectionRec>) =>
    setCollections((l) => l.map((c) => (c.id === id ? { ...c, ...patch } : c))), [])
  // Deleting a collection never deletes its content — it moves it to No Collection.
  const deleteCollection = useCallback((id: string) => {
    setRecords((l) => l.map((r) => (r.collectionId === id ? { ...r, collectionId: null } : r)))
    setCollections((l) => l.filter((c) => c.id !== id))
  }, [])
  const setCollection = useCallback((contentId: string, collectionId: string | null) =>
    setRecords((l) => l.map((r) => (r.id === contentId ? { ...r, collectionId } : r))), [])
  const collectionContent = useCallback((id: string) => records.filter((r) => r.collectionId === id), [records])

  const contentComments = useCallback(
    (id: string): ContentComment[] => comments.filter((c) => c.contentId === id).map((c) => ({ ...c, liked: likedComments.includes(c.id) })),
    [comments, likedComments],
  )
  const addComment = useCallback((contentId: string, text: string, parentId: string | null = null) => {
    const c: ContentComment = { id: rid('cm-'), contentId, author: demoUser.fullName, avatar: demoUser.photo, text, date: today(), likes: 0, parentId, mine: true, reported: false }
    setComments((l) => [c, ...l])
    setRecords((l) => l.map((r) => (r.id === contentId ? { ...r, comments: r.comments + 1 } : r)))
  }, [])
  const deleteComment = useCallback((id: string) => {
    setComments((l) => {
      const c = l.find((x) => x.id === id)
      if (c) setRecords((rl) => rl.map((r) => (r.id === c.contentId ? { ...r, comments: Math.max(0, r.comments - 1) } : r)))
      return l.filter((x) => x.id !== id)
    })
  }, [])
  const toggleCommentLike = useCallback((id: string) =>
    setLikedComments((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id])), [])
  const reportComment = useCallback((id: string) =>
    setComments((l) => l.map((c) => (c.id === id ? { ...c, reported: true } : c))), [])

  const value = useMemo<Ctx>(() => ({
    records, collections, comments, draft,
    getRecord, myContent, publicContent,
    saveDraft, resetDraft, loadDraftFrom, publish, publishRecords,
    updateRecord, archiveRecord, deleteRecord, incrementView, registerShare, registerDownload,
    createCollection, updateCollection, deleteCollection, setCollection, collectionContent,
    contentComments, addComment, deleteComment, toggleCommentLike, reportComment,
  }), [records, collections, comments, draft, getRecord, myContent, publicContent, saveDraft, resetDraft, loadDraftFrom, publish, publishRecords, updateRecord, archiveRecord, deleteRecord, incrementView, registerShare, registerDownload, createCollection, updateCollection, deleteCollection, setCollection, collectionContent, contentComments, addComment, deleteComment, toggleCommentLike, reportComment])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContentStore() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContentStore must be used within ContentProvider')
  return ctx
}

export type { Visibility }
