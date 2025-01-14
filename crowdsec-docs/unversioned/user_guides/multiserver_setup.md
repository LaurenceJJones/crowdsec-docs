---
id: multiserver_setup
title: About multi-server setup
sidebar_position: 10
---

import useBaseUrl from "@docusaurus/useBaseUrl"

## Introduction

Crowdsec's [architecture](/docs/next/intro#architecture) allows distributed setups, as most components communicate via [HTTP API](/docs/next/local_api/intro).

When doing such, a few considerations must be kept in mind to understand the role of each component:
 - The log processor is in charge of [processing the logs](/docs/next/parsers/intro), matching them against [scenarios](/docs/next/scenarios/intro), and sending the resulting alerts to the [local API](/docs/next/local_api/intro)
 - The local API (LAPI from now on) receives the alerts and converts them into decisions based on your profile
 - LAPI also takes care of communication with [CAPI](/docs/next/central_api/intro) to pull blocklists and push alerts to the console.
 - The remediation component query the LAPI to receive the decisions to be applied

 You can mix and match deployment methods and OS in the same setup, for example:
  - LAPI running on a Linux server
  - 1 log processor running on Windows alongside a [Windows Firewall remediation component](/u/bouncers/windows_firewall)
  - 1 log processor running in Docker on Linux alongside a [Firewall remediation component](/u/bouncers/firewall) running on Linux
  - 1 [Nginx remediation component](/u/bouncers/nginx) running on your webserver

<div style={{ display: "flex" }}>
    <div style={{ textAlign: "center", flex: "1" }}>
        <img src={useBaseUrl("/img/distributed_SE_setup.svg")}></img>
    </div>
</div>

## Setup

:::info

This guide will focus on using login/password authentication for the log processors for simplicity.

You can also use [TLS Authentication](/docs/next/local_api/tls_auth), which does not require to validate log processors but you will need to create a PKI.

:::

### LAPI

Follow the [getting started guide](/docs/next/getting_started/install_crowdsec) to install Crowdsec.

You will need to edit the `/etc/crowdsec/config.yaml` file to make LAPI listen on all interfaces:
```yaml
api:
  server:
    listen_uri: 0.0.0.0:8080
```

Optionally, if you only want to run a LAPI instance on this machine, you can disable the log processor in the same file by removing the `crowdsec_service` section.

You can also enable automatic registration of new machines to simplify adding log processors in the future by adding the following to the configuration file:

```yaml
api:
  server:
    auto_registration:
      enabled: true
      token: "long_token_that_is_at_least_32_characters_long"
      allowed_ranges:
        - 10.0.0.0/24
```

Both `token` and `allowed_ranges` are mandatory.

:::warning

Because a log processor can push arbitrary alerts to LAPI (and hence can easily lock you out), make sure to restrict as much as possible the allowed IPs and keep the token safe.

:::

Finally, restart crowdsec to apply the changes.

Note that LAPI only receives the alerts and turn them into decisions, this means:
 - You do not have to install any parser or scenario on it, they must be installed on the log processors directly.
 - If you want to have custom decisions (custom duration for example), you need to modify the file `/etc/crowdsec/profiles.yaml` on the LAPI, not on the log processors.

### Log processors

Again, follow the [getting started guide](/docs/next/getting_started/install_crowdsec) to install Crowdsec.

Once the installation is done, you need to edit the `/etc/crowdsec/config.yaml` to disable the LAPI running by default.
To do so, you can remove the entire `api.server` section from the file.

You can now use `cscli` to register the log processor in your LAPI:

```bash
$ sudo cscli lapi register --machine MyMachineName --url <lapi_url>
```

Credentials will be generated automatically and written to `/etc/crowdsec/local_api_credentials.yaml`

If you have configured auto registration on LAPI, you can specify the token in the `register` command:

```bash
$ sudo cscli lapi register --machine MyMachineName --url <lapi_url> --token long_token_that_is_at_least_32_characters_long
```

If not, you will need to validate the machine on LAPI:
```bash
$ sudo cscli machines validate MyMachineName
```

Finally, restart the log processor to use the new credentials.

You can check the validation status of a log processor with `cscli machines list` and looking at the `Status` column:

```bash
$ sudo cscli machines list
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Name                                              IP Address      Last Update           Status  Version                                           OS                            Auth Type  Last Heartbeat 
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 MyMachineName                                     192.168.4.142   2024-11-22T14:20:28Z  ✔️      v1.6.4-debian-pragmatic-amd64-523164f6-linux      Ubuntu/24.04                  password   33s                 
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
```

You can also verify the log processors can properly authenticate with LAPI by running this command on the machine the log processor is installed on:
```bash
$ sudo cscli lapi status
Loaded credentials from /etc/crowdsec/local_api_credentials.yaml
Trying to authenticate with username XXXXX on http://crowdsec.local:8080/
You can successfully interact with Local API (LAPI)
```

Repeat this procedure for each log processor you want to add to LAPI.

:::warning

Log processors do not share any information between them.
For example, if a load balancer randomly distributes traffic accross multiple web servers, it will take more time to detect bad traffic, as each log processor will only be seeing the logs from its respective server.

In this case, we recommend using a centralized logging solution and have a single log processor reading the logs there.

:::

### Remediation Components

:::info

Since crowdsec v1.6.4, multiple remediations components running on different machines can use the same API key.

:::

On installation, remediations components will try to automatically create an API key if they are installed on the same machine as LAPI, which likely won't be the case for a multi-server installation.

In this case, you will need to manually create an API key for you remediation component by running this command on your LAPI instance:

```bash
$ sudo cscli bouncers add MyBouncer
API key for 'MyBouncer':

   ulOPOSWxLcD8LaNmOMKOkYaG7AQYY+qZ2ho7pPyCAIU

Please keep this key since you will not be able to retrieve it!
```

Next, update the remediation component configuration file with the API key that you created and the URL to LAPI.

Remediation components will generally store their configuration in `/etc/crowdsec/bouncers/`, and the configuration directives naming for the API key and URL might vary from one remediation component to the other, please refer to the specific documentation of the component you have installed.