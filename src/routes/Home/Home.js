/*
 * @Author: quezhongyou 
 * @Date: 2018-08-02 14:06:29 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-08-13 11:38:19
 * @Last Modified time: 2018-08-15 23:40:44
 */

import React , {Component} from 'react';
import AppLink from 'components/AppLink';
import {Menu ,Dropdown,Input,Button, Icon,message} from 'antd';
import className from 'classnames';
import localStorage from 'localStorage';
import styles from './Home.less';

// 数组截取
const split_array =(arr, len)=>{   
  const a_len = arr.length;   
  const result = [];
  for(let i=0;i<a_len;i+=len){ 
     result.push(arr.slice(i,i+len)); 
  }   
  return result;
}
const Search = Input.Search; 
export default class Home extends Component {
  constructor(){
    super();
    const defaultState = {
      commonapp: [
        { type:'commonapp', icon:'xpxl', backgroundColor:'#49cad1',  text:'视频巡逻', url:'videoSystem',pinyin:'shipinxunluo'},
        { type:'commonapp',icon:'ryjc', backgroundColor:'#49cad1',  text:'以脸搜脸', url:'retrieva/personnelRetrieva',pinyin:'yiliansoulian'},
        { type:'commonapp', icon:'jksx', backgroundColor:'#72d8de',  text:'图上监控', url:'map/monitor',pinyin:'tushangjiankong'},
        { type:'commonapp',icon:'cljs', backgroundColor:'#5cb3d8',  text:'车辆检索', url:'carSearch',pinyin:'cheliangjiansuo'},
        { type:'commonapp',icon:'mdkgl', backgroundColor:'rgb(199, 116, 206)',  text:'名单库管理', url:'listLibray',pinyin:'mingdankuguanli'},
        { type:'commonapp', icon:'xwbk', backgroundColor:'#7b88e5',  text:'人员布控',url:'execute/personnelControl',pinyin:'renyuanbbukong'},
        { type:'commonapp', icon:'cl', backgroundColor:'#8a72ec',  text:'车辆布控',pinyin:'cheliangbukong'},
        { type:'commonapp',icon:'mhcx', backgroundColor:'#7492e1',  text:'模糊搜索',pinyin:'mohusousuo'},
        { type:'commonapp',icon:'ajjc', backgroundColor:'#67a3dc',  text:'案件检索',pinyin:'anjiansousuo'},
      ],
      pouapp: [
        { type:'pouapp', icon:'jksx', size:"small",backgroundColor:'#72d8de',  text:'图上监控', url:'map/monitor',pinyin:'tushangjiankong'},
        { type:'pouapp', icon:'xpxl', size:"small", backgroundColor:'#49cad1',  text:'视频巡逻', url:'videoSystem',pinyin:'shipinxunluo'},
        { type:'pouapp', icon:'ryjc', size:"small", backgroundColor:'#49cad1',  text:'以脸搜脸', url:'retrieva/personnelRetrieva',pinyin:'yiliansoulian'},
      ],
      menuVal:[
        { type:'commonapp',icon:'zfzx', backgroundColor:'#ba52f6',  text:'战法中心',pinyin:'zhanfazhongxin'},
        { type:'commonapp', icon:'xmsk', backgroundColor:'#a052f6',  text:'视频审看',pinyin:'shipinshenkan'},
      ],
      searchapp:[],
      searchState:false,
      searchValue:'',
    }

    // 设置localStorage
    const commonapp = localStorage.getItem('commonapp');
    const menuVal = localStorage.getItem('menuVal');
    const setLocalStorage =(name,val)=>{
      if(val){
         try{
            defaultState[name] = JSON.parse(val);
          }catch(e){
            localStorage.setItem(name,JSON.stringify(defaultState[name]));   
        }
      }else{
        localStorage.setItem(name,JSON.stringify(defaultState[name]));   
      }
    }
    setLocalStorage('commonapp',commonapp)
    setLocalStorage('menuVal',menuVal);
    
    // 设置状态
    this.state = defaultState;
  }
  componentDidMount(){
    message.config({
      top: 300,
      duration: 2,
      maxCount: 3,
    });
  }
  handleMenuClick = (e)=>{
      const val = JSON.parse(e.key);
      const {commonapp,menuVal} = this.state;
      const newMenuVal = menuVal.filter((item,i)=>item.icon!==val.icon);
      localStorage.setItem('commonapp',JSON.stringify([...commonapp,val]));
      localStorage.setItem('menuVal',JSON.stringify(newMenuVal));
      this.setState({commonapp:[...commonapp,val],menuVal:newMenuVal});
  }

  handleCloseClick = (state)=>()=>{
    const {menuVal} = this.state;
    const app = this.state[state.type];
    const newcommonapp = app.filter((item,i)=>item.text!==state.text);

    if(state.type === 'commonapp'){
      localStorage.setItem('commonapp',JSON.stringify(newcommonapp));
      localStorage.setItem('menuVal',JSON.stringify([...menuVal,state]));
      this.setState({[state.type]:newcommonapp,menuVal:[...menuVal,state]});
    }else{
      this.setState({[state.type]:newcommonapp});
    }
  }

  searchClick = (e)=>{// 模糊搜索
    
  }

  searchValueChange=(e)=>{
    const arr = [];
    const searchArr = [];
    for (let i = 0; i < this.state.commonapp.length; i++) {
      arr.push(this.state.commonapp[i]);
    }
    for (let j = 0; j < this.state.menuVal.length; j++) {
      arr.push(this.state.menuVal[j]);
    }
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].text.indexOf(e.target.value)>=0||arr[i].pinyin.indexOf(e.target.value)>=0) {
        searchArr.push(arr[i])
      }
    }
    this.setState({
      searchapp:searchArr,
      searchState:true,
      searchValue:e.target.value,
    })
    if (e.target.value=='') {
      this.setState({
        searchState:false,
      })
    }
  }

  closeSearch=()=>{// 关闭搜索结果
    this.setState({
      searchState:false,
      searchValue:'',
    })
  }

  Development=(item)=>{
    if (!item.url) {
      message.info('开发中！')
    }
  }

  render(){
    const {commonapp ,pouapp ,menuVal} = this.state;
    const listclass  =  className(styles.list,'clearfix');
    // 下拉菜单
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {menuVal.map(item=>{
        return (
          <Menu.Item key={JSON.stringify(item)}>
            {item.text}
          </Menu.Item>)
      })}
      </Menu>
    );

    // 数组截取
    const split_array =(arr, len)=>{   
      const a_len = arr.length;   
      const result = [];   
      for(let i=0;i<a_len;i+=len){   
        result.push(arr.slice(i,i+len));
      }   
     return result;
    }

    
    const list = (arr,ele, len)=>{
        let copyArr = [...arr];
        copyArr = split_array(copyArr, len);
        if(copyArr[copyArr.length-1] && copyArr[copyArr.length-1].length === 6){
          copyArr.push([]);
        };
        if(copyArr.length == 0){
          return ele;
        }
        return copyArr.map((list,index)=>(
          <div className={listclass}>
            { list.map((item,i)=>(<AppLink key={`${i}${index}`} {...item} handleCloseClick={this.handleCloseClick(item)} onClick={(e)=>this.Development(item)} />))}
            {index === copyArr.length-1 ?ele:''}
          </div>
)
        )
      }

      const suffix = this.state.searchValue ? <Icon type="close-circle-o" className={styles.seach_icon} onClick={()=>this.closeSearch()} /> : null;
      return (
        <div className={styles.home}>
          <Search suffix={suffix} value={this.state.searchValue} onChange={(e)=>this.searchValueChange(e)} className={styles.search} placeholder='输入应用名称' />
          
          <div className={styles.container}>
            <div className={styles.wrap}>
              <div className={styles.searchApp} style={this.state.searchState?{display:'block'}:{display:'none'}}>
                <h3>搜索结果</h3>
                {this.state.searchapp.length>0?list(this.state.searchapp,'',6):<p className={styles.noSearch}>暂无搜索结果!</p>}
              </div>
              <div className={styles.commonApp} style={this.state.searchState?{display:'none'}:{display:'block'}}>
                <h3>常用应用</h3>
                {list(commonapp,menuVal.length >= 0 ?(
                  <Dropdown overlay={menu} disabled={menuVal.length <= 0} trigger={['click']}>
                    <AppLink icon='jia' backgroundColor='#ba52f6' />
                  </Dropdown>
):'',6)}
              </div>
              <div style={this.state.searchState?{display:'none'}:{display:'block'}}>
                <h3>热门应用</h3>
                {list(pouapp,'',6)}
              </div>
            </div> 
          </div> 
        </div>
)
    }  
}