import React,{Component} from "react";

import {DefaultRedux,SecondRedux} from "../reduxHandler";

import {action1} from "../actions";


export default class SendReceiverMultiDomain extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:this.props.value};
        SecondRedux.connect(this.onStateToProp, this);
        DefaultRedux.connect(this.onStateToProp, this);
    }
    
    onStateToProp(state){
        return {term:state.term};
    }
    onChangeValue(e){
        this.setState({term:e.target.value});
        //send action to both of domains
        SecondRedux.runAction(this, action1, e.target.value);//send action3
        DefaultRedux.runAction(this, action1, e.target.value);//send action3
        
        /*
        //if you use single redux connection, you can use this.runAction function
        // instead of using DefaultRedux or SecondRedux.

        if(this.props.redux === "second")
            this.runAction(action1, e.target.value);//send action3
        else
            this.runAction(action1, e.target.value);//send action3
        */
    }
   
    render(){
        const val = this.state.term;
        return (
            <div>
                <span>Send(action1@(I/II)):
                <input onChange={this.onChangeValue} value={val}/>
                receive@(I/II):{this.state.props.term}</span>
            </div>
        );
    }
}