---
id: cscli_bouncers_delete
title: cscli bouncers delete
---
## cscli bouncers delete

delete bouncer(s) from the database

```
cscli bouncers delete MyBouncerName [flags]
```

### Examples

```
cscli bouncers delete "bouncer1" "bouncer2"
```

### Options

```
  -h, --help             help for delete
      --ignore-missing   don't print errors if one or more bouncers don't exist
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

* [cscli bouncers](/cscli/cscli_bouncers.md)	 - Manage bouncers [requires local API]

