import React, {
    useMemo,
  } from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const SIGNUP_LINK = `https://app.crowdsec.net/signup${process.env.NODE_ENV === 'production' ? '?mtm_campaign=Console&mtm_source=docs&mtm_medium=tocAd&mtm_content=Console' : ''}`
export default function ConsoleAd() {
    const { isDarkTheme } = useColorMode();
    const image = useMemo(() => {
        return isDarkTheme ? "/img/console_ad_dark.svg" : "/img/console_ad_light_alt.svg"
      }, [isDarkTheme]);
    return (
        <a href={SIGNUP_LINK} target="_blank">
            <img src={image} alt="CrowdSec Console" width="100%" />
        </a>
    );
  }