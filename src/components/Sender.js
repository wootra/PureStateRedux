import React,{Component} from "react";

import DefaultRedux from "../reduxHandler";
import {action1,action2} from "../actions";

export default class Sender extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:this.props.value};
        
        DefaultRedux.connect(null, this, true);//register as a sender
    }
    
    onStateToProp(state){
        return {term:state.term};
    }
    onChangeValue(e){
        this.setState({term:e.target.value});
        if(this.props.action==="1"){
            this.runAction(action1, e.target.value);//send action1
        }else if(this.props.action==="2"){
            this.runAction(action2, e.target.value);//send action2
        }
    }
   
    render(){
        const val = this.state.term;
        return (
            <div>
                Send Action({this.props.action})<input onChange={this.onChangeValue} value={val}/>
            </div>
        );
    }
}
