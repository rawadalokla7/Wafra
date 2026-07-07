import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Visible in the browser console for debugging, in addition to the
    // on-screen fallback below.
    console.error('Wafra crashed:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'sans-serif',
            background: '#F8F6F0',
            color: '#0A1F1A',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Something went wrong / صار خطأ
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#5F7A72', maxWidth: 480 }}>
            {this.state.error.message}
          </p>
          <pre
            style={{
              marginTop: '1rem',
              maxWidth: 600,
              overflow: 'auto',
              fontSize: '0.7rem',
              textAlign: 'left',
              background: '#F1EDE3',
              padding: '0.75rem',
              borderRadius: 8,
              direction: 'ltr',
            }}
          >
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1.25rem',
              padding: '0.6rem 1.25rem',
              borderRadius: 8,
              border: 'none',
              background: '#0F5C4B',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Reload / إعادة تحميل
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
