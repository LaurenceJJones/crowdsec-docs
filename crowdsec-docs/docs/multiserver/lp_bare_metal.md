---
id: lp_bare_metal
title: Bare metal setup
---

:::info
This guide is for bare metal setups. Bare metal is defined by installing it directly on the host machine, without using any containerization technology.
:::

## Prerequisites

### Mandatory

- A working [Security Engine](/getting_started/intro.md) setup on host machine
- A text editor (e.g. `nano`, `vim`, `emacs`)

## Configuring Security Engine

Since log processors will be connecting to a external LAPI we will need to configure it to login to the central LAPI before disabling the local LAPI of the log processor.

### Connect to the Central LAPI

Within setting up the central LAPI if you disabled remote registration, then you will follow the instructions for manual adding of the log processor.

#### Lapi Register

```bash title="Log Processor"
cscli lapi register -u http[s]://<central_lapi_ip>(:<central_lapi_port>)?
```

The above command will send a registration request to the central LAPI, if the request is successful you will have to approve the request on the central LAPI. If you have setup TLS on the central LAPI, you will have to use `https` in the above command. Also if you are using a FQDN for the central lapi you can also use that instead of the IP address.

The register command also supports `-m` flag to specify the machine id. If you do not specify a machine id, the machine id will be generated for you.

```bash title="Central LAPI"
cscli machines validate <machine_id>
```

:::info
You can find the machine id by running `cscli machines list`
:::

### Disable Local LAPI

Once the log processor is connected to the central LAPI we can disable the local LAPI.

```yaml title="config.yaml"
api:
  server:
    enable: false
```