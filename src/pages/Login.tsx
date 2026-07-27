import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Lock, Mail, ArrowRight, WifiOff, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { extractFieldErrors, getErrorMessage } from '@/lib/pocketbase/errors'
import type { FieldErrors } from '@/lib/pocketbase/errors'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [errorType, setErrorType] = useState<'generic' | 'inactive' | 'network'>('generic')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setFieldErrors({})
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      const errMsg = (error as any)?.message || ''
      const status = (error as any)?.status || 0

      if (errMsg === 'Usuário inativo') {
        setErrorType('inactive')
        setErrorMsg('Usuário inativo. Contate o administrador.')
      } else if (status === 0) {
        setErrorType('network')
        setErrorMsg('Erro de conexão. Verifique sua internet e tente novamente.')
      } else {
        const fErrors = extractFieldErrors(error)
        if (Object.keys(fErrors).length > 0) {
          setFieldErrors(fErrors)
          setErrorType('generic')
          setErrorMsg('')
        } else {
          setErrorType('generic')
          setErrorMsg(
            getErrorMessage(error) || 'Credenciais inválidas. Verifique seu e-mail e senha.',
          )
        }
      }
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 bg-grid-pattern">
      <div className="bg-card rounded-2xl border border-border shadow-modal p-8 max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/30 font-display mb-3">
            ✦ IBMS × Legacy School
          </span>
          <h1 className="text-2xl font-extrabold text-foreground font-display">
            SGPE — Gestão Estratégica
          </h1>
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            Acesse a plataforma colaborativa de planejamento
          </p>
        </div>

        {errorMsg && (
          <div
            className={`mb-4 p-3 rounded-lg border text-xs font-semibold text-center font-sans flex items-center justify-center gap-2 ${
              errorType === 'inactive'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                : errorType === 'network'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-600'
                  : 'bg-destructive/10 border-destructive/30 text-destructive'
            }`}
          >
            {errorType === 'inactive' && <UserX className="w-4 h-4 flex-shrink-0" />}
            {errorType === 'network' && <WifiOff className="w-4 h-4 flex-shrink-0" />}
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 font-sans">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: '' }))
                }}
                placeholder="seu.email@ibms.org.br"
                className={`w-full pl-9 pr-3 py-2.5 text-xs bg-card border rounded-lg focus:outline-none focus:ring-1 font-sans text-foreground ${
                  fieldErrors.email
                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                    : 'border-border focus:border-accent focus:ring-accent'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-xs text-destructive mt-1 font-sans">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 font-sans">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: '' }))
                }}
                placeholder="••••••••"
                className={`w-full pl-9 pr-3 py-2.5 text-xs bg-card border rounded-lg focus:outline-none focus:ring-1 font-sans text-foreground ${
                  fieldErrors.password
                    ? 'border-destructive focus:border-destructive focus:ring-destructive'
                    : 'border-border focus:border-accent focus:ring-accent'
                }`}
              />
            </div>
            {fieldErrors.password && (
              <p className="text-xs text-destructive mt-1 font-sans">{fieldErrors.password}</p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2" size="lg">
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Entrar na Plataforma</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-4 border-t border-border text-center">
          <p className="text-[11px] text-muted-foreground font-sans">
            Dúvidas de acesso? Contate a direção da{' '}
            <span className="font-semibold text-foreground">Escola IBMS</span>
          </p>
        </div>
      </div>
    </div>
  )
}
