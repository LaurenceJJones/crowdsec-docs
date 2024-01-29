import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';


function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div>
        <img src="/img/crowdsec_logo.png" width="25%" height="25%" style={{marginTop: '25px', marginBottom: '25px'}}/>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className={`button button--secondary ${styles["button-xl"]}`}
            to="/products">
            Get Started Now 🚀
          </Link>
          <Link
            className={`button button--secondary ${styles["button-xl"]}`}
            to="/docs/next/intro">
            Documentation 📖
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="CrowdSec, the open-source & participative IPS">
      <HomepageHeader />
    </Layout>
  );
}
