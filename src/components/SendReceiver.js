import React,{Component} from "react";

import PureStateRedux from "../pureStateRedux";
import {action2, action3} from "../actions";


export default class SendReceiver extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:this.props.value};
        
        PureStateRedux.connect(this.onStateToProp, true, this);
    }
    
    onStateToProp(state){
        return {term:state.term};
    }
    onChangeValue(e){
        this.setState({term:e.target.value});
        if(this.props.action==="3"){
            this.runAction(action3, e.target.value);//send action3
        }else{
            this.runAction(action2, e.target.value);//send action2
        }
    }
   
    render(){
        const val = this.state.term;
        return (
            <div>
                <p>Send(action{this.props.action}):<input onChange={this.onChangeValue} value={val}/></p>
                <p>receive:{this.state.props.term}</p>
            </div>
        );
    }
}