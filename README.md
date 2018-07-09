This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

I was studying about redux. and I thought few questions.
why is it so complex? 
why does it manipulate props in components? 
Is there really no way to handle states in the other components without manipulating props?

So, I decided to try to share states between components without touching props in the components.

Turns out it was possible.
So I made it this way as a module.

It worked for me well, but please let me know if there is some problem to use.

 
## Table of Contents

- [Updating to New Releases](#updating-to-new-releases)
- [Sending Feedback](#sending-feedback)
- [Folder Structure](#folder-structure)
- [Development / Debugging environment](#development--debugging-environment)
- [Supported Browsers](#supported-browsers)
- [How to use PureStateRedux](#how-to-use-purestateredux)
- [actions/index.js](#actionsindexjs)
- [reducers/index.js](#reducersindexjs)
- [reduxHandler/index.js](#reduxhandlerindexjs)
- [Register as a state receiver](#register-as-a-state-receiver)
- [Send an action](#send-an-action)
- [components/Sender.js](#componentssenderjs)
- [Receive a state](#receive-a-state)
- [components/Receiver.js](#componentsreceiverjs)
- [How to Send and Receive from/to other state domain](#how-to-send-and-receive-from--to-other-state-domain)
- [components/SendReceiver.js](#componentssendreceiverjs)
- [How to Send and Receive from/to multiple state domain](#how-to-send-and-receive-from--to-multiple-state-domain)
- [components/SendReceiverMultiDomain.js](#componentssendreceivermultidomainjs)
- [components/index.js](#componentsindexjs)
- [Something Missing?](#something-missing)


## Updating to New Releases

PureStateRedux is just one simple file:

* `pureStateRedux/index.js` is a class file for redux imitate functions that share component's states. But to separate state sharing domains, I used `reduxHandler/index.js` file to make instances of this class.

## Sending Feedback

I am always open to [your feedback](https://github.com/wootra/PureStateRedux/issues).

## Folder Structure

This project is consisted with one module file and sample files as long as development environment.
Remember, the module file is only src/PureStateRedux/index.js file.
I developed this module with VS Code and Create React App project.
Other files are the codes that are used for test the module.

```
.vscode/
  launch.json
  tasks.json
public/
  index.html
  favicon.ico
  manifest.json
src/
  actions/
    index.js
  components/
    Receiver.js
    Sender.js
    SendReceiver.js
    SendReceiverMultiDomain.js
    index.js
  pureStateRedux/
    index.js
  reducers/
    index.js
  reducerHandler/
    index.js
  App.css
  App.js
  App.test.js
  index.css
  index.js
  logo.svg
README.md
package.json
```

For the project to build :
* run `npm install`

## Development / Debugging environment

I configured development and debugging environment in VSCode, So you can just press F5 to debug the project if you install the extension "Debugger for chrome" on your VSCode.
When you press F5, it will launch 'npm start' before the chrome browser is automatically opened.

## Supported Browsers

PureStateRedux is developped by pure javascript with React, So if you can use React, it will run also. But I am not sure if this module would work for all javascript version. Please let me know if there some problem.
I have tested at React 16.4.1.

Here is all dependencies that I have used when I was developing it.
```
"axios": "^0.18.0",
"react": "^16.4.1",
"react-dom": "^16.4.1",
"react-router": "^4.3.1",
"react-router-dom": "^4.3.1",
"react-scripts": "^1.1.4",
"redux": "^4.0.0",
"redux-promise": "^0.6.0"

```


## How to use PureStateRedux

I tried to follow the naming with common redux syntax. But redux is a little too much work,
So I simplified importing and connect processes.

To make actions, make functions like this code:

### `actions/index.js`

```js
import axios from "axios";
const TEST_ACTION1 = "TEST_ACTION1";
const TEST_ACTION2 = "TEST_ACTION2";

//in this sample, I used 2 actions which uses mock server in the postman application.
//in the postman application, I made a 2 APIs that response 
// {"a":1} by GET request of /test/term/1
// {"a":2} by GET request of /test/term/2
export const action1 = function(term){
    let url = "https://ce360567-b6f8-4cd1-9c36-ccb3d4c409db.mock.pstmn.io";
    return {
        type:TEST_ACTION1,
        payload: axios.get(url+"/test/term/"+term)
    };
}
export const action2 = function(term){
    return {
        type:TEST_ACTION2,
        payload: {a:"pure obj"}
    };
}
export const ACTION_TYPES = {TEST_ACTION1, TEST_ACTION2};

const ACTIONS = {
    action1, action2,
    TEST_ACTION1, TEST_ACTION2
};
export default ACTIONS;
```

To make reducers, just make code like this:


### `reducers/index.js`


```js
import {ACTION_TYPES} from "../actions";
//the payload will be the object which will be returned by a running of an action.
function reducer1(type,payload){
    switch(type){
        case ACTION_TYPES.TEST_ACTION1:
            return {term:payload.data.a};
        case ACTION_TYPES.TEST_ACTION2:
            return {term:payload.a};
        default:
            return {};
    }
}

export default reducer1;
```

To separate state sharing domain, I made a file that manages PureStateRedux instances.

### `reduxHandler/index.js`

```js
import PureStateRedux from "../pureStateRedux";

export const DefaultRedux = PureStateRedux("default");
export const SecondRedux = PureStateRedux("second");

export default DefaultRedux;
```

Now we have two domains that share states of components separately.
I will write down how to use two domains later. 
Now Let's talk with DefaultRedux instance and how to use it.

## Register as a state receiver

To register your component as an action sender or state receiver, just call 'connect' function of PureStateRedux instance(DefaultRedux).
in the connect function, there is three arguments.

```js
DefaultRedux.connect(stateToPropMapForReceiver:function, instanceToUse:Component, addRunAction:bool);
```

stateToPropMapForReceiver function will look like this:

```js
onStateToProp(state){
	return {term:state.term}
}
```

instanceToUse is usually 'this' if you call connect function in the constructor.

and addRunAction will be true if your component will use only one PureStateRedux domain. It will allow for your component to use this.runAction(action:function, arg:object) function. 
But PureStateRedux support multiple state domains, so If your component will send an action to multiple state domains, you have to set this argument to false.

## Send an action

Here is a sample code so you can register your component as a action sender.
### `components/Sender.js`
```js
import React,{Component} from "react";

import DefaultRedux from "../reduxHandler";
import {action1,action2} from "../actions";

export default class Sender extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:this.props.value};
        
        DefaultRedux.connect(null, this, true);//register as a sender
    }
    
    onStateToProp(state){
        return {term:state.term};
    }
    onChangeValue(e){
        this.setState({term:e.target.value});
        if(this.props.action==="1"){
            this.runAction(action1, e.target.value);//send action1
        }else if(this.props.action==="2"){
            this.runAction(action2, e.target.value);//send action2
        }
    }
   
    render(){
        const val = this.state.term;
        return (
            <div>
                Send Action({this.props.action})<input onChange={this.onChangeValue} value={val}/>
            </div>
        );
    }
}
```

## Receive a state

And this is an example code that you can register your component as a state receiver. Note that this component used this.state.props.term state.
onStateToProp function will change the state from a reducer, and it will pass to this.state.props state. In redux, it will be this.props.term, but in PureStateRedux, it will be this.state.props.term.


### `components/Receiver.js`

```js
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
```

## How to Send and Receive from/to other state domain

In PureStateRedux, state will be shared in each state domain. It means you cannot share the state if you are not belong to the same state domain.
But Sending an action has no limitation whether or not your component belongs to any state domain.

### `components/SendReceiver.js`

```js
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
```

In the SendReceiver.js file, the action invoked not related to the state domain that the component belongs to.

## How to Send and Receive from/to multiple state domain

PureStateRedux allows for a component to join multiple state domains. 

### `components/SendReceiverMultiDomain.js`

```js
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
```

In the example code SendReceiverMultiDomain.js file, you can send an action to multiple domains, and also you can receive the state from the multiple domains. 


### `components/index.js`

```js
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
...
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
            </div>
        )
    }
}
```

## Something Missing?

If something is missing in this module, please let me know.

Thanks!