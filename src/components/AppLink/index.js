/*
 * @Author: quezhongyou 
 * @Date: 2018-08-02 18:21:05 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-09-05 13:45:03
 */
import { Link } from 'dva/router';
import {Icon} from 'antd';
import className from 'classnames';
import styles from './index.less';

const dev = window.SSystem.development ;

/**
 * @description 首页应用链接
 */
export default ({icon,backgroundColor,text,url,borderColor,size ='middle',onClick ,handleCloseClick})=>{
    const cls =  className(styles.appBtn,styles[icon],styles[size],{[styles.notextIcon]:!text});

    return (
      <div className={cls} style={{backgroundColor,borderColor}} onClick={onClick}>
        {url?
          (text !='视频巡逻'?
          <Link className={styles.btn} to={url}>{ text } </Link>:
          <a className={styles.btn} href={(dev?'#':'')+url}>{ text }</a>
         ):
          <span className={styles.btn}>{ text }</span>}
        {text? <Icon className={styles.close} type="close" onClick={handleCloseClick} />:''}
      </div>
)
}