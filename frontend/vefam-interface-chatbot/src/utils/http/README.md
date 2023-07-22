## cách sử dụng

### Get ask

```
import { http } from "/@/utils/http";

// params pass parameters
http.request('get', '/xxx', { params: param });

// url splicing parameters
http.request('get', '/xxx?message=' + msg);
```

### Post ask

```
import { http } from "/@/utils/http";

// params pass parameters
http.request('post', '/xxx', { params: param });

// data pass parameters
http.request('post', '/xxx', { data: param });
```
