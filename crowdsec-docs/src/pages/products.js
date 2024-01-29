import React, {useState} from "react";;
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

function HomepageHeader() {
    const [securityEngine, setSecurityEngine] = useState(false);
    return (
        <div className={`${styles["product-helper-container"]}`}>
            <h1 className={`hero`}>
                Which solution is right for you?
            </h1>
            <div className={styles.buttons}>
                <Link
                    className={`button button--secondary button--lg ${styles["button-xl"]}`}
                    to="/products"
                    onClick={() => setSecurityEngine(!securityEngine)}
                >
                    Security Engine
                </Link>
                <Link
                    className={`button button--secondary button--lg ${styles["button-xl"]}`}
                    to="/products"
                >
                    Blocklists
                </Link>
                <Link
                    className={`button button--secondary button--lg ${styles["button-xl"]}`}
                    to="/products"
                >
                    CTI
                </Link>
            </div>
            {securityEngine && <>SE's</>}
            <div className={styles.buttons}>
                <Link
                    className={`button button--primary button--lg ${styles["button-xl"]} ${styles["help-button"]}`}
                    to="/products"
                >
                    Help me choose ⛑️
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
