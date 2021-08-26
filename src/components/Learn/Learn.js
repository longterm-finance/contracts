import React, { useState } from 'react'
import './learn.css'
import { useMediaQuery } from 'react-responsive'
import RedditIcon from '@material-ui/icons/Reddit'
import TwitterIcon from '@material-ui/icons/Twitter'
import TelegramIcon from '@material-ui/icons/Telegram'
import YouTubeIcon from '@material-ui/icons/YouTube'
import DocsIcon from '@material-ui/icons/MenuBook'
import RoadmapIcon from '@material-ui/icons/Timeline'
import LitepaperIcon from '@material-ui/icons/LibraryBooks'
import FAQIcon from '@material-ui/icons/Help'
import GitHubIcon from '@material-ui/icons/GitHub'
// import AuditReportIcon from '@material-ui/icons/BugReport'

const Learn = ({ isDarkMode }) => {
  const isMobileView = useMediaQuery({ query: '(max-width: 510px)' })

  const WhatIsAvix = () => {
    return (
      <div
        className={`what-is-avix-container ${
          isDarkMode ? 'learn-card-dark-mode' : 'learn-card'
        }`}
      >
        <h2 className="what-is-avix-title mb-4">What is Avix Finance?</h2>
        <p className="what-is-avix-desc">
          <strong>
            Avix Finance makes it possible for everyone to mint derived VIX
            (dVIX),
          </strong>{' '}
          the world’s first token that tracks the CBOE Volatility Index (VIX) in
          1:1 ratio.{' '}
        </p>
        <p className="what-is-avix-desc">
          <strong>
            dVIX does not experience any time decay as it never expires,
          </strong>{' '}
          which makes it a much more reliable hedge for the broader market
          volatility.
        </p>
        <p className="what-is-avix-desc">
          dVIX is <strong>safely overcollateralized by at least 150%,</strong>{' '}
          using crypto assets such as WETH, MATIC, DAI, USDC and WBTC.
        </p>
        <p className="what-is-avix-desc">
          {' '}
          Avix Finance is currently{' '}
          <strong>deployed on the Polygon (Matic) network, </strong>
          with plans for expansion onto other networks over time.
        </p>{' '}
        <p className="what-is-avix-desc">
          <strong>To learn more about Avix Finance,</strong> please visit{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://avix.finance"
            className="doc-link"
            style={{
              color: '#e84142',
              fontWeight: 'bold',
            }}
          >
            our official website
          </a>{' '}
          and also check out the available resources on this page.
        </p>
      </div>
    )
  }

  const Video = () => {
    return (
      <div
        className={`video-container ${
          isDarkMode ? 'learn-card-dark-mode' : 'learn-card'
        }`}
      >
        <h2 className="video-title mb-4">Intro to Avix Finance</h2>
        <iframe
          src="https://www.youtube.com/embed/NpEaa2P7qZI"
          title="YouTube Video Player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="mr-4 video"
        />
      </div>
    )
  }

  const Instructions = () => {
    return (
      <div
        className={`instructions-container ${
          isDarkMode ? 'learn-card-dark-mode' : 'learn-card'
        }`}
      >
        <h2 className="instructions-title mb-4">Instructions</h2>
        <p className="instruction-desc">
          <strong>1.) Ideas: </strong>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.avix.finance/platform-overview/how-to-use-dvix"
            className="doc-link"
            style={{
              color: '#e84142',
              fontWeight: 'bold',
            }}
          >
            How to Use dVIX
          </a>
        </p>

        <p className="instruction-desc">
          <strong>2.) Tutorial: </strong>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.avix.finance/platform-overview/tutorial-how-to-mint-and-burn-dvix"
            className="doc-link"
            style={{
              color: '#e84142',
              fontWeight: 'bold',
            }}
          >
            How to Mint & Burn dVIX
          </a>
        </p>

        <p className="instruction-desc">
          <strong>3.) Tutorial: </strong>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://docs.avix.finance/platform-overview/tutorial-advanced-trading-strategies"
            className="doc-link"
            style={{
              color: '#e84142',
              fontWeight: 'bold',
            }}
          >
            Advanced Trading Strategies
          </a>
        </p>
      </div>
    )
  }

  const Resources = () => {
    return (
      <div
        className={`resources-container ${
          isDarkMode ? 'learn-card-dark-mode' : 'learn-card'
        }`}
      >
        <h2 className="resources-title mb-4">Resources</h2>

        <div className="resources-blocks">
          <div className="resources-block-1">
            <p className="resources-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://docs.avix.finance/"
                className="doc-link bold resources-link-inner"
              >
                <DocsIcon style={{ color: isDarkMode ? '#b7b7b7' : '#000' }} />
                <span className="ml-2">Docs</span>
              </a>
            </p>
            <p className="resources-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://docs.avix.finance/litepaper"
                className="doc-link bold resources-link-inner"
              >
                <LitepaperIcon
                  style={{ color: isDarkMode ? '#b7b7b7' : '#000' }}
                />
                <span className="ml-2">Litepaper</span>
              </a>
            </p>
            <p className="resources-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://github.com/avix-finance"
                className="doc-link bold resources-link-inner"
              >
                <GitHubIcon
                  style={{ color: isDarkMode ? '#b7b7b7' : '#000' }}
                />
                <span className="ml-2">Github</span>
              </a>
            </p>
          </div>
          <div className="resources-block-2">
            <p className="resources-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://docs.avix.finance/roadmap-overview"
                className="doc-link bold resources-link-inner"
              >
                <RoadmapIcon
                  style={{ color: isDarkMode ? '#b7b7b7' : '#000' }}
                />
                <span className="ml-2">Roadmap</span>
              </a>
            </p>
            <p className="resources-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://docs.avix.finance/faqs"
                className="doc-link bold resources-link-inner"
              >
                <FAQIcon style={{ color: isDarkMode ? '#b7b7b7' : '#000' }} />
                <span className="ml-2">FAQs</span>
              </a>
            </p>
            {/* @NOTE: ADD THIS LINK AFTER COMPLETING THE AVIX CODE AUDIT */}
            {/* <p className="resources-link">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://avix.finance/Avix_Finance_Code_Audit.pdf"
              className="doc-link bold resources-link-inner"
            >
              <AuditReportIcon 
                style={{ color: isDarkMode ? '#b7b7b7' : '#000' }}
              />
              <span className="ml-2">Docs</span>
            </a>
          </p> */}
          </div>
        </div>
      </div>
    )
  }

  const [copyAddressClicked1, setCopyAddressClicked1] = useState(false)
  const [copyAddressClicked2, setCopyAddressClicked2] = useState(false)

  const copyAddress1 = () => {
    const el = document.createElement('input')
    el.value = '0xa275a30492B138639726b43385D0703aa65F8107'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }

  const onCopyAddressClicked1 = () => {
    setCopyAddressClicked1(true)
    setTimeout(() => setCopyAddressClicked1(false), 2000)
  }

  const copyAddress2 = () => {
    const el = document.createElement('input')
    el.value = 'bc1qdkryvyvvm52mujn587ut608n3xhkj0dm8dsrz7'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }

  const onCopyAddressClicked2 = () => {
    setCopyAddressClicked2(true)
    setTimeout(() => setCopyAddressClicked2(false), 2000)
  }

  const Support = () => {
    return (
      <div
        className={`support-container ${
          isDarkMode ? 'learn-card-dark-mode' : 'learn-card'
        }`}
      >
        <h2 className="support-title mb-4">Support</h2>
        <p className="support-desc">
          The fastest way to get support is to send an email to{' '}
          <a
            href="mailto:wecare@avix.finance"
            className="doc-link bold"
            style={{ fontWeight: 'bold', color: '#e84142' }}
          >
            wecare@avix.finance
          </a>
        </p>
        <p className="support-desc">
          Email support is maintained by a{' '}
          <strong>group of volunteers from the Avix community</strong> and is
          supported by tips.
        </p>
        <p className="support-desc">
          If you are satisfied by the support group's answers,{' '}
          <strong>please consider sending some tips:</strong>
        </p>
        <p className="support-desc">
          <strong>ETH, MATIC & Stablecoins: </strong>
          <span
            onClick={() => {
              copyAddress1()
              onCopyAddressClicked1()
            }}
            className="copy-address-span"
          >
            {isMobileView
              ? // eslint-disable-next-line
                '0xa275a30492B138639726b43385' + ' ' + 'D0703aa65F8107'
              : '0xa275a30492B138639726b43385D0703aa65F8107'}
          </span>{' '}
          <span
            style={{ display: 'block', color: '#1771f8', fontWeight: 'bold' }}
          >
            [Click on the address to copy]{' '}
            {copyAddressClicked1 && (
              <span
                className="ml-2"
                style={{ color: isDarkMode ? '#fff' : '#000' }}
              >
                <i
                  className="far fa-check-circle"
                  style={{
                    color: 'green',
                  }}
                />{' '}
                Copied!
              </span>
            )}
          </span>
        </p>
        <p className="support-desc">
          <strong>BTC: </strong>{' '}
          <span
            onClick={() => {
              copyAddress2()
              onCopyAddressClicked2()
            }}
            className="copy-address-span"
          >
            {isMobileView
              ? // eslint-disable-next-line
                'bc1qdkryvyvvm52mujn587ut608n3' + ' ' + 'xhkj0dm8dsrz7'
              : 'bc1qdkryvyvvm52mujn587ut608n3xhkj0dm8dsrz7'}
          </span>{' '}
          <span
            style={{ display: 'block', color: '#1771f8', fontWeight: 'bold' }}
          >
            [Click on the address to copy]{' '}
            {copyAddressClicked2 && (
              <span
                className="ml-2"
                style={{ color: isDarkMode ? '#fff' : '#000' }}
              >
                <i
                  className="far fa-check-circle"
                  style={{
                    color: 'green',
                  }}
                />{' '}
                Copied!
              </span>
            )}
          </span>
        </p>
        <p className="support-desc">
          Also, you can ask our community for the support in our{' '}
          <a
            href="https://t.me/joinchat/vcN1SWLifF01M2M0"
            target="_blank"
            rel="noreferrer"
            className="doc-link community-link-inner"
          >
            Telegram Group,{' '}
          </a>
          <a
            href="https://discord.com/invite/ahu8kpwXM3"
            target="_blank"
            rel="noreferrer"
            className="doc-link community-link-inner"
          >
            Discord Server,{' '}
          </a>
          or{' '}
          <a
            href="https://www.reddit.com/r/AvixFinance"
            target="_blank"
            rel="noreferrer"
            className="doc-link community-link-inner"
          >
            Avix Subreddit.
          </a>
        </p>
      </div>
    )
  }

  const MediumIcon = () => {
    return (
      <svg
        width="22.5"
        height="22.5"
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        clipRule="evenodd"
        fill={isDarkMode ? '#b7b7b7' : '#000'}
      >
        <path d="M2.846 6.887c.03-.295-.083-.586-.303-.784l-2.24-2.7v-.403h6.958l5.378 11.795 4.728-11.795h6.633v.403l-1.916 1.837c-.165.126-.247.333-.213.538v13.498c-.034.204.048.411.213.537l1.871 1.837v.403h-9.412v-.403l1.939-1.882c.19-.19.19-.246.19-.537v-10.91l-5.389 13.688h-.728l-6.275-13.688v9.174c-.052.385.076.774.347 1.052l2.521 3.058v.404h-7.148v-.404l2.521-3.058c.27-.279.39-.67.325-1.052v-10.608z" />
      </svg>
    )
  }

  const DiscordIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17.5"
        height="17.5"
        viewBox="0 0 71 55"
        fill="none"
      >
        <script xmlns="" />
        <g clipPath="url(#clip0)">
          <path
            d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
            /* fill={isDarkMode ? '#b7b7b7' : '#000'} */
            fill="#5165F6"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="71" height="55" fill="white" />
          </clipPath>
        </defs>
        <script
          xmlns=""
          type="text/javascript"
          src="chrome-extension://fnnegphlobjdpkhecapkijjdkgcjhkib/inject-script.js"
        />
      </svg>
    )
  }

  const Community = () => {
    return (
      <div
        className={`community-container ${
          isDarkMode ? 'learn-card-dark-mode' : 'learn-card'
        }`}
      >
        <h2 className="community-title mb-4">Community</h2>
        <div className="community-blocks">
          <div className="community-block-1">
            <p className="community-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.reddit.com/r/AvixFinance"
                className="doc-link bold community-link-inner"
              >
                <RedditIcon
                  style={{
                    /* color: isDarkMode ? '#b7b7b7' : '#000'  */
                    color: '#FF4019',
                  }}
                />
                <span className="ml-2">Reddit</span>
              </a>
            </p>
            <p className="community-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://twitter.com/AvixFinance"
                className="doc-link bold community-link-inner"
              >
                <TwitterIcon
                  style={{
                    /* color: isDarkMode ? '#b7b7b7' : '#000'  */
                    color: '#1CB7EB',
                  }}
                />
                <span className="ml-2">Twitter</span>
              </a>
            </p>
            <p className="community-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://t.me/joinchat/vcN1SWLifF01M2M0"
                className="doc-link bold community-link-inner"
              >
                <TelegramIcon
                  style={{
                    /* color: isDarkMode ? '#b7b7b7' : '#000'  */
                    color: '#139BD0',
                  }}
                />
                <span className="ml-2">Telegram</span>
              </a>
            </p>
          </div>
          <div className="community-block-2">
            <p className="community-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://discord.com/invite/ahu8kpwXM3"
                className="doc-link bold community-link-inner"
              >
                <DiscordIcon
                  style={{
                    color: isDarkMode ? '#b7b7b7' : '#000',
                  }}
                />
                <span className="ml-2">Discord</span>
              </a>
            </p>
            <p className="community-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://blog.avix.finance/?gi=86a61103afcf"
                className="doc-link bold community-link-inner"
              >
                <MediumIcon
                  style={{ color: isDarkMode ? '#b7b7b7' : '#000' }}
                />
                <span className="ml-2">Medium</span>
              </a>
            </p>
            <p className="community-link">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.youtube.com/channel/UCkgW-1n32AiSDlLaTrsBwEg"
                className="doc-link bold community-link-inner"
              >
                <YouTubeIcon
                  style={{
                    /* color: isDarkMode ? '#b7b7b7' : '#000' */
                    color: '#FF0000',
                  }}
                />
                <span className="ml-2">YouTube</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${
        !isDarkMode ? 'learn-container' : 'learn-container-dark-mode'
      } mb-5`}
    >
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <h1
        className="text-center bold mb-5 mt-5 learn-title"
        style={{ fontSize: '3.15rem', color: isDarkMode && '#fff' }}
      >
        Learn About Avix Finance
      </h1>

      <div className="learn-grid">
        <WhatIsAvix />
        <Video />
        <Instructions />
        <Resources />
        <Support />
        <Community />
      </div>
      <br />
      <br />
      <br />
    </div>
  )
}

export default Learn
