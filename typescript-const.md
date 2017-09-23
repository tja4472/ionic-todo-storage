``` typescript
// TypeScript 2.2.2
type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export interface Widget {
  id: string;
  aa: { ss: string }
}
export const WidgetInitialState: Widget = {
  id: '1111',
  aa: { ss: 'zzzz' },
}

export function WidgetInitialStateFunction(): Widget {
  return {
    id: '1111',
    aa: { ss: 'zzzz' }
  }
}

const WidgetInitialStateReadonly: Readonly<Widget> = {
  id: '1111',
  aa: { ss: 'zzzz' },
}

const WidgetInitialStateDeepReadonly: DeepReadonly<Widget> = {
  id: '1111',
  aa: { ss: 'zzzz' },
}
```
``` typescript
    let widgetInitialState = WidgetInitialState;
    // widgetInitialState.id:1> 1111
    console.log('widgetInitialState.id:1>', widgetInitialState.id);

    widgetInitialState.id = 'oh no';
    // widgetInitialState.id:2> oh no
    console.log('widgetInitialState.id:2>', widgetInitialState.id);

    let widgetInitialStateFunction = WidgetInitialStateFunction;
    // widgetInitialStateFunction().id:1> 1111
    console.log('widgetInitialStateFunction().id:1>', widgetInitialStateFunction().id);
    // widgetInitialStateFunction().aa.ss:1> zzzz
    console.log('widgetInitialStateFunction().aa.ss:1>', widgetInitialStateFunction().aa.ss);

    widgetInitialStateFunction().id = 'oh no';
    widgetInitialStateFunction().aa.ss = 'oh no';

    // widgetInitialStateFunction().id:2> 1111
    console.log('widgetInitialStateFunction().id:2>', widgetInitialStateFunction().id);
    // widgetInitialStateFunction().aa.ss:2> zzzz
    console.log('widgetInitialStateFunction().aa.ss:2>', widgetInitialStateFunction().aa.ss)

    let widgetInitialStateReadonly = WidgetInitialStateReadonly;
    // widgetInitialStateReadonly.id:1> 1111
    console.log('widgetInitialStateReadonly.id:1>', widgetInitialStateReadonly.id);
    // widgetInitialStateReadonly.aa.ss:1> zzzz
    console.log('widgetInitialStateReadonly.aa.ss:1>', widgetInitialStateReadonly.aa.ss);
    // widgetInitialStateReadonly.id = 'oh no'; // error :)
    widgetInitialStateReadonly.aa.ss = 'oh no';
    // widgetInitialStateReadonly.id:2> 1111
    console.log('widgetInitialStateReadonly.id:2>', widgetInitialStateReadonly.id);
    // widgetInitialStateReadonly.aa.ss:2> oh no
    console.log('widgetInitialStateReadonly.aa.ss:2>', widgetInitialStateReadonly.aa.ss);

    let widgetInitialStateDeepReadonly = WidgetInitialStateDeepReadonly;
    // widgetInitialStateDeepReadonly.id:1> 1111
    console.log('widgetInitialStateDeepReadonly.id:1>', widgetInitialStateDeepReadonly.id);
    // widgetInitialStateDeepReadonly.aa.ss:1> zzzz
    console.log('widgetInitialStateDeepReadonly.aa.ss:1>', widgetInitialStateDeepReadonly.aa.ss);
    // widgetInitialStateDeepReadonly.id = 'oh no'; // error :)
    // widgetInitialStateDeepReadonly.aa.ss = 'oh no'; // error :)
```
#### Reference
https://forum.ionicframework.com/t/where-should-i-create-data-models/88308/4
