import React , {Component} from 'react';
import { Icon ,Collapse  } from 'antd';
import styles from './Yun.less';

const Panel = Collapse.Panel;


export default class Yun extends Component {
        state={
            type:-1,
            show:true
        }

    PTZControl =(type)=>()=>{
        this.setState({type});
        this.props.helper.PTZControl(type);
    }

    contral=[{
        add:9,
        remove:10,
        stop:11,
        text:'焦距',
    },{
        add:12,
        remove:13,
        stop:14,
        text:'焦点',
    },{
        add:15,
        remove:16,
        stop:17,
        text:'光圈',
    },
]
    handleClick =()=>{
        this.setState({show:!this.state.show});
    }
    render(){
        const {type,show} = this.state; const typeArr = [0,1,2,3]; const contral = this.contral;
        return (
          <div className={styles.yun}>
          <div className={styles.title}>
            <i />云台 <Icon className={`${styles.icon} ${show?styles.show:''}`} type="down" theme="outlined"  onClick={this.handleClick}/>
          </div>
          <div className={`${styles.body} ${show?'':styles.hide}`}>
          <div className={styles.arrowBox}>
                  <div className={styles.arrows}>
                    <span className={styles.arrowup}>
                      <i  
                        className={`${type == 0 ?' active':''}`}
                        type="arrow-up" 
                        title="上"
                        onClick={this.PTZControl(0)}
                      />
                    </span>
                    <span className={styles.arrowdown}>
                      <i 
                        className={`${styles.down} ${type == 1 ?' active':''}`}
                        type="arrow-up"
                        title="下"
                        style={{color:type == 1 ?'#1890ff':''}} 
                        onClick={this.PTZControl(1)}
                      />
                    </span>
                    <span className={styles.arrowleft}>
                      <i 
                        className={`${styles.left} ${type == 2 ?' active':''}`}
                        type="arrow-up"
                        title="左" 
                        style={{color:type == 2 ?'#1890ff':''}}
                        onClick={this.PTZControl(2)}
                      />
                    </span>
                    <span className={styles.arrowright}>
                      <i 
                        className={`${styles.right} ${type == 3 ?' active':''}`}
                        type="arrow-up" 
                        title="右" 
                        style={{color:type == 3 ?'#1890ff':''}}
                        onClick={this.PTZControl(3)}
                      />
                    </span>
                      
                    {typeArr.indexOf(type)>=0 ?
                         (
                           <span className={styles.arrowstop}>
                             <i 
                               className='active'
                               title="停止" 
                               onClick={this.PTZControl(8)}
                             />
                           </span>
):<span className={styles.arrowstop}><i /></span>
                        }
                       
                  </div>
                </div>
                <div className={styles.contral}>
                  {contral.map(item=>{
                        return (
                          <div className='clearfix'>
                            <Icon
                              type="minus" 
                              style={{background:type == item.remove ?'#1890ff':''}}  
                              onClick={this.PTZControl(type == item.remove  ?item.stop:item.remove )}
                            />
                            <span>{item.text}</span>
                            <Icon
                              type="plus" 
                              style={{background:type == item.add ?'#1890ff':''}} 
                              onClick={this.PTZControl(type == item.add ? item.stop:item.add)}
                            />
                          </div>
)
                    })}
                </div>
            </div>
          </div>
)
    }
}