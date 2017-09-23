### completed-todo.service.ts
``` typescript
export abstract class CompletedTodoService {...};
```
### completed-todo-live.service.ts
``` typescript
import { CompletedTodoService } from './completed-todo.service';

export class CompletedTodoServiceLive implements CompletedTodoService {...}
```
### app.module.ts
``` typescript
import { CompletedTodoService } from '../services/completed-todo.service';
import { CompletedTodoServiceLive } from '../services/completed-todo-live.service';
// import { CompletedTodoServiceMock } from '../services/completed-todo-mock.service';

providers: [
        { provide: CompletedTodoService, useClass: CompletedTodoServiceLive },
```
### current-todo-live.service.ts
``` typescript
import { CompletedTodoService } from '../services/completed-todo.service';
import { CurrentTodoService } from './current-todo.service';

constructor(
        private authService: AuthService,
        private completedTodoService: CompletedTodoService,
)
```