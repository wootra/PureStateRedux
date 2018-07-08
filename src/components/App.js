import React,{Component,createRef} from "react";
import PureStateRedux from "../pureStateRedux/pureStateRedux";


export default class App extends Component{
    constructor(props){
        super(props);
        this.c1 = createRef();
        this.c2 = createRef();
 
        this.val = "0";
        PureStateRedux.connect(this.onStateToProp, false, this);
    }
    onStateToProp(state){
        return {term:state.term};
    }
    render(){
        return(
            <div>
                <Sender value={this.val}/>
                <Receiver value={this.val}/>
                <SendReceiver value={this.val} action="1"/>
                <SendReceiver value={this.val} action="2"/>
                
                                
                <span>{this.state.term}</span>
            </div>
        )
    }
}