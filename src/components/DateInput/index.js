/*
 * @Author: quezhongyou 
 * @Date: 2018-08-08 09:49:40 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-08-09 16:29:56
 * @description how do you use it ?
 * <DateInput
        className ={style.carDate}
        onhandleStartDateChange = {this.onhandleDateChange}
        onhandleEndDateChange = {this.onhandleDateChange}
    />
 */

import React, { Component } from 'react';
import {Icon} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DateInput } from "@blueprintjs/datetime";
import MomentLocaleUtils from 'react-day-picker/moment';
import  '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import 'moment/locale/zh-cn';
import './index.less';

export default class DateRangeInput  extends Component {
    constructor(props){
        super(props);
        const { defaultStartValue , defaultEndValue,startValue,endValue } = props;
        const yearTime = 3600*1000*24*365; const newTime = new Date().getTime();
        
        this.state = {
            maxDate: endValue || new Date(newTime + yearTime*100),
            minDate: startValue || new Date(newTime - yearTime*100),
        }  
    }

    static propTypes = {
        onhandleEndDateChange : PropTypes.func,
        onhandleStartDateChange : PropTypes.func,
        className : PropTypes.string,
        defaultStartValue : PropTypes.any,
        defaultEndValue : PropTypes.any,
        startValue : PropTypes.any,
        endValue : PropTypes.any,
      };
    
    static defaultProps = {
        onhandleEndDateChange: () => {},
        onhandleStartDateChange: () => {},
        className: '',
      };
    
    /**
     * @description 时间解析设置
     */
    onhandleDateChange = (callback)=>(rangDate)=>(date)=>{
        if(date){
            const time = date.getTime();
            this.setState({[rangDate]:date});
            callback(time);
        }
    }

    render(){
        const { onhandleStartDateChange , onhandleEndDateChange , className , defaultStartValue , defaultEndValue , startValue , endValue ,maxDate ,minDate }  = this.props;
        // const { maxDate ,minDate } =this.state;
        
        return (
          <div className={className}>
            <DateInput
              timePrecision='second'
              value={startValue}
              maxDate={maxDate}
              canClearSelection={false}
              dayPickerProps={{
                  locale:'zh-cn',
                  localeUtils:MomentLocaleUtils,
                }}
              defaultValue={defaultStartValue}
              placeholder="YYYY-MM-DD HH:mm:ss"
              formatDate={date => moment(date).format("YYYY-MM-DD HH:mm:ss")}
              parseDate={str => moment(str, "YYYY-MM-DD HH:mm:ss").toDate()}
              onChange={this.onhandleDateChange(onhandleStartDateChange)('minDate')}
            />
            <Icon type="minus" />
            <DateInput
              timePrecision='second'
              dayPickerProps={{
                    locale:'zh-cn',
                    localeUtils:MomentLocaleUtils,
                  }}
              value={endValue}
              canClearSelection={false}
              defaultValue={defaultEndValue}
              minDate={minDate}
              placeholder="YYYY-MM-DD HH:mm:ss"
              formatDate={date => moment(date).format("YYYY-MM-DD HH:mm:ss")}
              parseDate={str => moment(str, "YYYY-MM-DD HH:mm:ss").toDate()}
              onChange={this.onhandleDateChange(onhandleEndDateChange)('maxDate')}
            />
          </div>
)
    }
}
