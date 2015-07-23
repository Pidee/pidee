Protocol
========

Overview
--------

`<REQ-TOKEN> <DOMAIN> <METHOD> [<VALUE>]`

## Requests

- `<REQ-TOKEN> <DOMAIN> GET`
- `<REQ-TOKEN> <DOMAIN> SET <VALUE>`
- `<REQ-TOKEN> <DOMAIN> SUBSCRIBE`
- `<REQ-TOKEN> <DOMAIN> UNSUBSCRIBE`

_Note: `<REQ-TOKEN>` is a word starting with #

## Responce

- `ERROR <CODE> <MESSAGE>` _Error, for request without token_
- `<REQ-TOKEN> ERROR <CODE> <MESSAGE>` _Error, for request with token_
- `<REQ-TOKEN> <DOMAIN> <VALUE>` _Subscription responces_
- `<REQ-TOKEN> DONE` _All responses sent_

Domains
-------

| Domain          | Value Range | 
|-----------------|:-----------:|
| _all_           |             |
| __led__         | [0,8]       |
| __led.yellow__  | [0,1]       |
| __led.green__   | [0,1]       |
| __led.red__     | [0,1]       |
| __dip__         | [0,255]     |
| __dip.0__       | [0,1]       |
| __dip.1__       | [0,1]       |
| __dip.2__       | [0,1]       |
| __dip.3__       | [0,1]       |
| __dip.4__       | [0,1]       |
| __dip.5__       | [0,1]       |
| __dip.6__       | [0,1]       |
| __dip.7__       | [0,1]       |
| __button__      | [0,1]       |

| Domain  | GET      | SET      | (UN)SUBSCRIBE |
|---------|:--------:|:--------:|:-------------:|
| led     |          | &#x2713; |               | 
| dip     | &#x2713; |          | &#x2713;      | 
| button  | &#x2713; |          | &#x2713;      | 
| _all_   | &#x2713; |          | &#x2713;      | 

Examples
--------

- `#e324d led.yellow SET 0`

Error Codes
-----------

- 0: Unkown error
- 1: Invaild or missing token
- 2: Invalid or missing domain
- 3: Invalid or missing method
- 4: Missing value
- 5: GET not allowed on domain
- 6: SET not allowed on domain
- 7: SUBSCRIBE and UNSUBSCRIBE not allowed on domain
- 8: Invalid value
- 9: Subscription for token not found

Testing Protocol in Terminal
----------------------------

```bash
echo "#12341234 led SET 5" | nc -U /tmp/pidee.sock
```


