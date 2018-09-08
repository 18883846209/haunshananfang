import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'dva/router';
import {Icon,Button } from 'antd';
import styles from './index.less';
import PropTypes from 'prop-types';

export default class DeleteTips  extends Component {
    constructor(props){
        super(props);
        const { deleteSure,deleteCancel,deleteStyle } = props;
    }
    static propTypes = {
        deleteSure : PropTypes.func,
        deleteCancel:PropTypes.func,
        deleteStyle:PropTypes.any,
      };
    static defaultProps = {
        deleteSure: () => {},
        deleteCancel:() => {},
      };
    disScroll = (e) => {
        e.stopPropagation();
        e.preventDefault(); 
      }
    render(){
        const {deleteSure,deleteCancel,deleteStyle}  = this.props;
        return (
            <div className={ styles.delmask } id="delmask" style={deleteStyle}  onWheel={ this.disScroll }>
                <div className={ styles.del_mask } onClick={ deleteCancel}></div>
                <div className={ styles.del_con }>
                    <div className={ styles.deltitle }>
                        <span>提示</span>
                        <Icon type="close" style={{ cursor: 'pointer' }} onClick={ deleteCancel} />
                    </div>
                    <div className={styles.deltip}>
                        <div className={styles.delicon} />
                        <span>是否确认删除？</span>
                    </div>
                    <div className={styles.delbtn}>
                        <Button type="primary" onClick={deleteSure}>确定</Button>
                        <Button ref="del_cancel" onClick={deleteCancel}>取消</Button>
                    </div>
                </div>
            </div>
        )
    }
}