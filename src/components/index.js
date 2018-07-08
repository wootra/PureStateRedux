import React,{Component,createRef} from "react";
import PureStateRedux from "../pureStateRedux";
import Sender from "./Sender";
import Receiver from "./Receiver";
import SendReceiver from "./SendReceiver";
import reducer1 from "../reducers";

PureStateRedux.addReducers(reducer1);

export default class PureStateReduxTest extends Component{
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
                Send(action1):<Sender value={this.val}/>
                Recv:<Receiver value={this.val}/>
                <SendReceiver value={this.val} action="2"/>
                <SendReceiver value={this.val} action="3"/>
                
                                
                <span>{this.state.term}</span>
            </div>
        )
    }
}