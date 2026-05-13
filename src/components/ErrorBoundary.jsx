import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: '#8a9ab0',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <p style={{ fontSize: '15px' }}>
            Something went wrong rendering your itinerary.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              marginTop: '16px',
              padding: '10px 24px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #d4a853, #b8894a)',
              color: '#0a0a0f',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
