import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function HomepageHeader() {
    return (
        <div className="container">
            <h2>
                Our Products
            </h2>
            <div className={styles.buttons}>
                <Link
                    className={`button button--secondary button--lg ${styles.buttonxl}`}
                    to="/products"
                >
                    Security Engine
                </Link>
                <Link
                    className={`button button--secondary button--lg ${styles.buttonxl}`}
                    to="/products"
                >
                    Blocklists
                </Link>
                <Link
                    className={`button button--secondary button--lg ${styles.buttonxl}`}
                    to="/products"
                >
                    CTI
                </Link>
            </div>
            <div className={styles.buttons}>
                <Link
                    className={`button button--secondary button--lg ${styles.buttonxl}`}
                    to="/products"
                >
                    Help
                </Link>
            </div>
        </div>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="CrowdSec, the open-source & participative IPS"
        >
            <HomepageHeader />
        </Layout>
    );
}
