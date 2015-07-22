Protocol
========

Overview
--------

`<REQ-TOKEN>` Word

## Requests

- `<REQ-TOKEN> <DOMAIN> GET`
- `<REQ-TOKEN> <DOMAIN> SET <VALUE>`
- `<REQ-TOKEN> <DOMAIN> SUBSCRIBE`
- `<REQ-TOKEN> <DOMAIN> UNSUBSCRIBE`

## Responce

- `<REQ-TOKEN> OK` _Recieved_
- `ERROR <MESSAGE>` _Error, for request without token_
- `<REQ-TOKEN> ERROR <MESSAGE>` _Error, for request with token_
- `<REQ-TOKEN> <DOMAIN> <VALUE>` _Subscription responces_

| Domain  | GET      | SET      | (UN)SUBSCRIBE |
|---------|----------|----------|---------------|
| led     |          | &#x2713; |          | 
| dip     | &#x2713; |          | &#x2713; | 
| button  | &#x2713; |          | &#x2713; | 
| all     |          |          | &#x2713; |

Domains
-------

| Domain  | Value Range |
|---------|-------------|
| __all__ | * |
| __led__ | [0,8] |
| __led.yellow__ | [0,1] |
| __led.green__ | [0,1] |
| __led.red__ | [0,1] |
| __dip__ | [0,255] |
| __dip.0__ | [0,1] |
| __dip.1__ | [0,1] |
| __dip.2__ | [0,1] |
| __dip.3__ | [0,1] |
| __dip.4__ | [0,1] |
| __dip.5__ | [0,1] |
| __dip.6__ | [0,1] |
| __dip.7__ | [0,1] |
| __switch__ | [0,1] |

Examples
--------

- `e324d led.yellow SET`





