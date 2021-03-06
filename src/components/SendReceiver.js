import React,{Component} from "react";

import {DefaultRedux,SecondRedux} from "../reduxHandler";

import {action1} from "../actions";


export default class SendReceiver extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:this.props.value};
        if(props.recvDomain === "second")
            SecondRedux.connect(this.onStateToProp, this);
        else //default
            DefaultRedux.connect(this.onStateToProp, this);
    }
    
    onStateToProp(state){
        return {term:state.term};
    }
    onChangeValue(e){
        this.setState({term:e.target.value});
        if(this.props.actionDomain === "second")
            SecondRedux.runAction(this,action1, e.target.value);//send action3
        else
            DefaultRedux.runAction(this,action1, e.target.value);//send action3
        
        /*
        //if you use single redux connection, you can use this.runAction function
        // instead of using DefaultRedux or SecondRedux.

        if(this.props.redux === "second")
            this.runAction(action2, e.target.value);//send action3
        else
            this.runAction(action2, e.target.value);//send action3
        */
    }
   
    render(){
        const val = this.state.term;
        return (
            <div>
                <span>Send(action1@{this.props.actionDomain}):
                <input onChange={this.onChangeValue} value={val}/>
                receive({this.props.recvDomain}):{this.state.props.term}</span>
            </div>
        );
    }
}