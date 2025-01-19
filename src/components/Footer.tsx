import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-xl font-bold">StockInsights.AI</span>
            </div>
            <p className="text-sm text-slate-300">Empowering investors with AI-driven financial research.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-sm text-slate-300 hover:text-white transition-colors duration-200">Features</Link></li>
              <li><Link href="#pricing" className="text-sm text-slate-300 hover:text-white transition-colors duration-200">Pricing</Link></li>
              <li><Link href="/blog" className="text-sm text-slate-300 hover:text-white transition-colors duration-200">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-slate-300 hover:text-white transition-colors duration-200">About</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-300 hover:text-white transition-colors duration-200">Contact</Link></li>
              <li><Link href="/privacy" className="text-sm text-slate-300 hover:text-white transition-colors duration-200">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200">Twitter</Link></li>
              <li><Link href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200">LinkedIn</Link></li>
              <li><Link href="#" className="text-sm text-slate-300 hover:text-white transition-colors duration-200">GitHub</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} StockInsights.AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

