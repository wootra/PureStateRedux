import React,{Component} from "react";

import PureStateRedux from "../pureStateRedux";

export default class Receiver extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:this.props.value};
        
        PureStateRedux.connect(this.onStateToProp, false, this);//register as a receiver
    }
    
    onStateToProp(state){
        return {term:state.term};
    }
    onChangeValue(e){
        this.setState({term:e.target.value});
    }
   
    render(){
        const val = this.state.props.term;
        return (
            <div>
                <input onChange={this.onChangeValue} value={val}/>
            </div>
        );
    }
}