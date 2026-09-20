import { Component } from 'react';

export default class PageBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main className="container section">
      <p role="alert">Halaman tidak dapat ditampilkan. Muat ulang untuk mencoba lagi.</p>
      <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>Muat ulang</button>
    </main>;
    return this.props.children;
  }
}
