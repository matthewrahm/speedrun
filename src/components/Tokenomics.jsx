import { useState } from 'react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import './Tokenomics.css'

function Tokenomics() {
  const [copied, setCopied] = useState(false)
  const { ref, isVisible } = useScrollAnimation()
  const tokenAddress = import.meta.env.VITE_TOKEN_ADDRESS || 'TOKEN_ADDRESS'

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(tokenAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <section className="tokenomics-section section" ref={ref}>
      <h2 className={`section-title scroll-fade-in ${isVisible ? 'visible' : ''}`}>CONTRACT ADDRESS</h2>

      <div className={`contract-section scroll-fade-in ${isVisible ? 'visible' : ''}`}>
        <div className="contract-address" onClick={copyToClipboard}>
          <span className="address-text">
            {tokenAddress.slice(0, 8)}...{tokenAddress.slice(-8)}
          </span>
          <button className={`copy-button ${copied ? 'copied' : ''}`}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="contract-full" onClick={copyToClipboard}>
          {tokenAddress}
        </div>
      </div>
    </section>
  )
}

export default Tokenomics
