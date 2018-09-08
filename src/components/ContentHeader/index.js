import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { Link } from 'dva/router';
import {message } from 'antd';
import style from './index.less';
import PropTypes from 'prop-types';

export default class ContentHeader  extends Component {
    constructor(props){
        super(props);
        const { contentTitle } = props;
    }
    static propTypes = {
        contentTitle : PropTypes.string
      };
    static defaultProps = {
        contentTitle: ''
      };
    returnback=()=>{
        message.info("开发中，本期暂不提供该功能")
    }
    render(){
        return (
            <div className={style.title_div}>
                <span>{this.props.contentTitle}</span>
                <div className={style.goBack} onClick={this.returnback}>
                <i className={style.return} alt=" " />
                <span>返回上一步</span>
                </div>
            </div> 
        )
    }
}