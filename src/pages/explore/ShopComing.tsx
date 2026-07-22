import { useNavigate } from 'react-router-dom'
import { Store } from 'lucide-react'
import BackHeader from '../../components/BackHeader'
import EmptyState from '../../components/EmptyState'
import PrimaryButton from '../../components/PrimaryButton'

export default function ShopComing() {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col bg-bg">
      <BackHeader title="Shop" />
      <div className="flex flex-1 items-center justify-center">
        <EmptyState
          icon={<Store className="h-7 w-7" strokeWidth={1.6} />}
          title="Shop is on its way"
          description="The full Shop experience — masterclasses, digital resources, merchandise and secure checkout — will be available in the next prototype phase."
          action={<PrimaryButton onClick={() => navigate('/explore')}>Back to Explore</PrimaryButton>}
        />
      </div>
    </div>
  )
}
