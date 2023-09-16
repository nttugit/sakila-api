### Cần bổ sung

- Check post fields
- Exception handling

## How to import/export

### Import hết file

module.exports = obj
const obj = require('');

export default obj;
import obj from ''

### Import từng đối tượng

exports.fnA = functionA(){}
exports.fnB = functionB(){}
const {fnA, fnB} = require('')

export function fnA(){}
export function fnB(){}
import {fnA, fnB} from ''
hoặc import tất cả functions thông qua một biến cho gọn
import \* as c from ''

=> Nên dùng ECMAScript (type module) vì các thư viện bây giờ đang chuyển dần sang cách này
