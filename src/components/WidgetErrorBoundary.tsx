import { Component, ErrorInfo, ReactNode, Fragment } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  title?: string
}

interface State {
  hasError: boolean
  retryKey: number
}

export class WidgetErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, retryKey: 0 }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WidgetErrorBoundary caught error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, retryKey: this.state.retryKey + 1 })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-amber-900 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{this.props.title || 'Não foi possível carregar esta seção.'}</span>
          <button
            onClick={this.handleRetry}
            className="ml-auto flex items-center gap-1 text-amber-700 hover:text-amber-900 font-bold underline"
          >
            <RotateCcw className="w-3 h-3" />
            Tentar novamente
          </button>
        </div>
      )
    }

    return <Fragment key={this.state.retryKey}>{this.props.children}</Fragment>
  }
}
