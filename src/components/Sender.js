import React,{Component} from "react";

import PureStateRedux from "../pureStateRedux";
import {action1} from "../actions";

export default class Sender extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:this.props.value};
        
        PureStateRedux.connect(null, true, this);//register as a sender
    }
    
    onStateToProp(state){
        return {term:state.term};
    }
    onChangeValue(e){
        this.setState({term:e.target.value});
        this.runAction(action1, e.target.value);//send action
    }
   
    render(){
        const val = this.state.term;
        return (
            <div>
                <input onChange={this.onChangeValue} value={val}/>
            </div>
        );
    }
}
