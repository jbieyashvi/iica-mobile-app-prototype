import { Navigate, useParams } from 'react-router-dom'
import BasicsEditor from './editors/BasicsEditor'
import AboutEditor from './editors/AboutEditor'
import DomainEditor from './editors/DomainEditor'
import TimelineEditor from './editors/TimelineEditor'
import AwardsEditor from './editors/AwardsEditor'
import MediaEditor from './editors/MediaEditor'
import CollaborationsEditor from './editors/CollaborationsEditor'
import PerformancesEditor from './editors/PerformancesEditor'
import EduExpEditor from './editors/EduExpEditor'
import GalleryEditor from './editors/GalleryEditor'
import TestimonialsEditor from './editors/TestimonialsEditor'
import SocialEditor from './editors/SocialEditor'
import CollabPrefsEditor from './editors/CollabPrefsEditor'

const MAP: Record<string, () => JSX.Element> = {
  basics: BasicsEditor,
  about: AboutEditor,
  domain: DomainEditor,
  timeline: TimelineEditor,
  awards: AwardsEditor,
  media: MediaEditor,
  collaborations: CollaborationsEditor,
  performances: PerformancesEditor,
  education: EduExpEditor,
  gallery: GalleryEditor,
  testimonials: TestimonialsEditor,
  social: SocialEditor,
  collabPrefs: CollabPrefsEditor,
}

export default function SectionEditor() {
  const { section } = useParams()
  const Editor = section ? MAP[section] : undefined
  if (!Editor) return <Navigate to="/portfolio/setup" replace />
  return <Editor />
}
