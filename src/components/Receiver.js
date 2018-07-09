import React,{Component} from "react";

import DefaultRedux from "../reduxHandler";

export default class Receiver extends Component{
    constructor(props){
        super(props);
        this.state = {term:this.props.value};
        
        DefaultRedux.connect(this.onStateToProp, this);//register as a receiver
    }
    
    onStateToProp(state){
        return {term:state.term};
    }
    
    render(){
        return (
            <div>
                received: {this.state.props.term}
            </div>
        );
    }
}