import './polyfill' ;
import dva from 'dva' ;
import createHistory from 'history/createHashHistory';
// user BrowserHistory
import createBrowserHistory from 'history/createBrowserHistory';

import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
 
import './index.less';

// 1. Initialize
const app = dva({
  history: window.SSystem.development ? createHistory():createBrowserHistory(),
});

// 2. Plugins
app.use(createLoading());

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');

export default app._store; // eslint-disable-line
