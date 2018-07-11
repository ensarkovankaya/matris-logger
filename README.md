# Logger

Wrapper for [winston](https://www.npmjs.com/package/winston) logger.

## Usage

```
# logger.ts

import { initLogger } from 'matris-logger';

// Define log folder
const logFolder = process.env.LOG_FOLDER || 'logs';

export const getLogger = initLogger(logFolder);
```


```
# account.service.ts

import { getLogger } from './logger';

const logger = getLogger('AccountService', ['service']);

logger.info('Message', {username: 'user1', age: 23);

// OUTPUT:
// {"name":"AccountService","labels":["service"],"meta":{"username":"user1","age":23},"level":"info","message":"Message","timestamp":"2018-07-11T23:39:43.760Z"}

```
