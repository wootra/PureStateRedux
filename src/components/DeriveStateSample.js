import React,{Component,createRef} from "react";

class ChildComponent extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:[]};
    }
    
    onChangeValue(e){
        this.setState({term:[e.target.value]});
        this.props.onChildUpdate(this, e.target.value);    
    }
    static getDerivedStateFromProps(props, state){
        console.log(props);
        console.log(state);
        return {...state, term: [props.value, ...state.term]};
    }
    showTermLog(term){
        let i=0;
        return term.map(x=>(
            <li key={++i}>{x}</li>
        ));
    }
    render(){
        const val = this.props.value;
        return (
            <div>
                <input onChange={this.onChangeValue} value={val}/>
                <div style={{borderStyle:"solid",borderColor:"#ff0000",height:100,overflowY:"auto"}}>
                    <ul>{this.showTermLog(this.state.term)}</ul>
                </div>
            </div>
        );
    }
}


class ChildComponent2 extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:this.props.value};
    }
    
    onChangeValue(e){
        this.setState({term:e.target.value});
        this.props.onChildUpdate(this, e.target.value); 
        this.props = {value:"test"}; //NOT POSSIBLE
        this.state = {value:"test"}; //ONLY POSSIBLE IN THE CONSTRUCTOR
        this.setState({value:"test"})
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



export default class DerivedStateSample extends Component{
    constructor(props){
        super(props);
        this.c1 = createRef();
        this.c2 = createRef();
        this.c3 = createRef();
        this.c4 = createRef();
        this.state = {val1: "initVal", val2: "initVal"};
        this.onChildUpdate = this.onChildUpdate.bind(this);
    }
    onChildUpdate(target, value){
        if(target !==this.c1.current) this.setState({val1: value});
        if(target !==this.c2.current) this.setState({val2: value});
    }
    render(){
        return(
            <div>
                <ChildComponent name="c1" ref={this.c1}
                                value={this.state.val1}
                                onChildUpdate={(t,v)=>this.onChildUpdate(t,v)}/>
                <ChildComponent2 name="c2" ref={this.c2}
                                value={this.state.val2}
                                onChildUpdate={(t,v)=>this.onChildUpdate(t,v)}/>
                <ChildComponent name="c3" ref={this.c3}
                                value={this.state.val1}
                                onChildUpdate={(t,v)=>this.onChildUpdate(t,v)}/>
                <ChildComponent2 name="c4" ref={this.c4}
                                value={this.state.val2}
                                onChildUpdate={(t,v)=>this.onChildUpdate(t,v)}/>
                
            </div>
        )
    }
}