import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Mail, AlertTriangle } from 'lucide-react'
import AuthShell from '../../components/AuthShell'
import IdBlock from '../../components/IdBlock'
import PrimaryButton from '../../components/PrimaryButton'
import SecondaryButton from '../../components/SecondaryButton'
import { useAuth } from '../../state/AuthContext'

export default function MembershipSubmitted() {
  const navigate = useNavigate()
  const { state } = useAuth()

  return (
    <AuthShell
      showBack={false}
      footer={
        <>
          <PrimaryButton
            full
            onClick={() => navigate('/membership/payment-pending')}
          >
            View Payment Instructions
          </PrimaryButton>
          <div className="mt-2.5">
            <SecondaryButton full onClick={() => navigate('/')}>
              Return to Home
            </SecondaryButton>
          </div>
        </>
      }
    >
      <div className="flex flex-col items-center pt-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EE] text-success">
          <CheckCircle2 className="h-9 w-9" strokeWidth={1.75} />
        </div>
        <h1 className="mt-5 font-serif text-[27px] leading-tight text-ink">
          Your application has been submitted
        </h1>
        <p className="mt-2 max-w-[300px] text-[14px] leading-relaxed text-muted">
          Here is your unique creator identity. Keep it handy — you'll need it to
          complete payment.
        </p>
      </div>

      <div className="mt-6">
        <IdBlock id={state.iicaId ?? 'RP.673.IICA'} />
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-control border border-border bg-surface px-3.5 py-3">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p className="text-[13px] leading-relaxed text-muted">
          Your ID and an external payment link have been emailed to{' '}
          <span className="font-semibold text-ink">
            {state.email || 'your email'}
          </span>
          .
        </p>
      </div>

      <div className="mt-3 flex items-start gap-3 rounded-control border border-warning/30 bg-[#F7F0E4] px-3.5 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p className="text-[13px] leading-relaxed text-[#7a5412]">
          You'll need to enter this ID on the payment page to activate your
          membership.
        </p>
      </div>
    </AuthShell>
  )
}
