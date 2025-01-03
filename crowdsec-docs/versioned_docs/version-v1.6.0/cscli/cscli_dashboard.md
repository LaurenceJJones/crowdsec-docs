---
id: cscli_dashboard
title: cscli dashboard
---
## cscli dashboard

Manage your metabase dashboard container [requires local API]

### Synopsis

Install/Start/Stop/Remove a metabase container exposing dashboard and metrics.
Note: This command requires database direct access, so is intended to be run on Local API/master.
		

### Examples

```

cscli dashboard setup
cscli dashboard start
cscli dashboard stop
cscli dashboard remove

```

### Options

```
  -h, --help   help for dashboard
```

### Options inherited from parent commands

```
      --color string    Output color: yes, no, auto (default "auto")
  -c, --config string   path to crowdsec config file (default "/etc/crowdsec/config.yaml")
      --debug           Set logging to debug
      --error           Set logging to error
      --info            Set logging to info
  -o, --output string   Output format: human, json, raw
      --trace           Set logging to trace
      --warning         Set logging to warning
```

### SEE ALSO

* [cscli](/cscli/cscli.md)	 - cscli allows you to manage crowdsec
* [cscli dashboard remove](/cscli/cscli_dashboard_remove.md)	 - removes the metabase container.
* [cscli dashboard setup](/cscli/cscli_dashboard_setup.md)	 - Setup a metabase container.
* [cscli dashboard show-password](/cscli/cscli_dashboard_show-password.md)	 - displays password of metabase.
* [cscli dashboard start](/cscli/cscli_dashboard_start.md)	 - Start the metabase container.
* [cscli dashboard stop](/cscli/cscli_dashboard_stop.md)	 - Stops the metabase container.

