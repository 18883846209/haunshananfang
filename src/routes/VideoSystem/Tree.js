/*
 * @Author: quezhongyou 
 * @Date: 2018-08-30 11:53:09 
 * @Last Modified by: quezhongyou
 * @Last Modified time: 2018-09-01 14:22:49
 */
import React , {Component} from 'react';
import ResTree from 'components/ResTree';

/**
 * @description 资源树
 */
export  default class Tree extends Component {
    state = {
            expandedKeys: null,
            autoExpandParent: true,
            checkedKeys: [],
            selectedKeys: [],
    }

    onExpand = (state)=>{
        this.setState({...this.state , ...state});
    }

    onCheck =(state)=>{
        this.setState({...this.state ,...state},()=>{
           this.props.onCheck(this.state.checkedKeys,this.props.helper);
        });
    }

    onSelect =(state)=>{
        this.setState({...this.state , ...state});
    }

    
    render(){
        const { treeResult , treerelative , jheight ,dcheckedid} = this.props;
        const tree = treeResult.length > 0?(
          <ResTree
            jheight={jheight}
            dcheckedid ={dcheckedid}
            {...this.state}
            expandedKeys={this.state.expandedKeys || [treeResult[0].id]}
            treeData={treeResult}
            onExpand={this.onExpand}
            onCheck={this.onCheck}
            onSelect={this.onSelect}
            treerelative={treerelative}
          />
):'';
        return tree ;
    }
}