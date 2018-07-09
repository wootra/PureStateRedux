import React,{Component,createRef} from "react";
import DefaultRedux,{SecondRedux} from "../reduxHandler";
import Sender from "./Sender";
import Receiver from "./Receiver";
import SendReceiver from "./SendReceiver";
import SendReceiver2 from "./SendReceiverMultiDomain";
import reducer1 from "../reducers";

DefaultRedux.addReducers(reducer1);
SecondRedux.addReducers(reducer1);

export default class DefaultReduxTest extends Component{
    constructor(props){
        super(props);
        this.c1 = createRef();
        this.c2 = createRef();
 
        this.val = "0";
        DefaultRedux.connect(this.onStateToProp, this);
    }
    onStateToProp(state){
        return {term:state.term};
    }
    render(){
        return(
            <div>
                <Sender value={this.val} action="1"/>
                <Sender value={this.val} action="2"/>
                <Receiver value={this.val}/>
                <SendReceiver value={this.val} recvDomain="default" actionDomain="default"/>
                <SendReceiver value={this.val} recvDomain="second" actionDomain="second"/>
                <SendReceiver value={this.val} recvDomain="second" actionDomain="default"/>
                <SendReceiver value={this.val} recvDomain="default" actionDomain="second"/>
                <SendReceiver2 value={this.val}/>
                                
                <span>{this.state.term}</span>
            </div>
        )
    }
}