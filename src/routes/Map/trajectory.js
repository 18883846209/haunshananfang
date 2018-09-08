
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom'
import $ from 'jquery';
import { connect } from 'dva';
import moment from 'moment';
import style from './MapMonitor.less';
import Item from '../../../node_modules/antd/lib/list/Item';
import { Link } from '../../../node_modules/dva/router';


export default class Map extends PureComponent {
    constructor() {
      super();
    }

    render() {
        return (
          <div style={{ color: 'gray' }}>
            开发中，本期暂不提供该功能！
          </div>
        )
    }
}