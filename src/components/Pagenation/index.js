import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'dva/router';
import {Pagination } from 'antd';
import styles from './index.less';
import PropTypes from 'prop-types';

export default class Pagenation  extends Component {
    constructor(props){
        super(props);
        const { toFirst,toLast,pagStyle,firstStyle,listOnChange,defaultCurrent,defaultPageSize,currentPage,totlePage} = props;
    }
    static propTypes = {
        toFirst : PropTypes.func,
        toLast:PropTypes.func,
        listOnChange : PropTypes.func,
        pagStyle:PropTypes.any,
        firstStyle:PropTypes.any,
        defaultCurrent:PropTypes.any,
        defaultPageSize:PropTypes.any,
        currentPage:PropTypes.any,
        totlePage:PropTypes.any,
      };
    static defaultProps = {
        toFirst: () => {},
        toLast:() => {},
        listOnChange:() => {},
      };
    render(){
        const {toFirst,toLast,pagStyle,firstStyle,listOnChange,defaultCurrent,defaultPageSize,currentPage,totlePage}  = this.props;
        return (
            <div style={pagStyle}>
                <div className={styles.itemRenderFirst} onClick={toFirst} style={firstStyle}>首页</div>
                <Pagination
                    defaultCurrent={defaultCurrent}
                    defaultPageSize={defaultPageSize}
                    showQuickJumper
                    current={currentPage}
                    total={totlePage}
                    onChange={listOnChange}
                />
                <div className={styles.itemRenderLast} onClick={toLast} style={firstStyle}>尾页</div>
            </div>
        )
    }
}