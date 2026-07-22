export type UpdateKind = 'performance' | 'release' | 'workshop' | 'announcement'

export interface UpdateItem {
  id: string
  kind: UpdateKind
  label: string
  title: string
  meta: string
  image: string
}

export const whatsNew: UpdateItem[] = [
  {
    id: 'u1',
    kind: 'release',
    label: 'New Release',
    title: '“Antaraal” — a new EP by Kabir Menon',
    meta: 'Out now · 6 tracks',
    image:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80&auto=format&fit=crop',
  },
  {
    id: 'u2',
    kind: 'performance',
    label: 'Performance',
    title: 'Arjun Desai live at the Ahmedabad Ghazal Nights',
    meta: 'This Saturday · 7:30 PM',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&q=80&auto=format&fit=crop',
  },
  {
    id: 'u3',
    kind: 'workshop',
    label: 'Workshop',
    title: 'Introduction to pigment painting with Meera Iyer',
    meta: 'Enrolling · 12 seats left',
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300&q=80&auto=format&fit=crop',
  },
  {
    id: 'u4',
    kind: 'announcement',
    label: 'Announcement',
    title: 'Devraj Singh joins the IICA mentorship circle',
    meta: 'Applications open next week',
    image:
      'https://images.unsplash.com/photo-1466428996289-fb355538da1b?w=300&q=80&auto=format&fit=crop',
  },
]
