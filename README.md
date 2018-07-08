This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Table of Contents

- [Updating to New Releases](#updating-to-new-releases)
- [Sending Feedback](#sending-feedback)


## Updating to New Releases

PureStateRedux is just one simple file:

* `index.js` is the function file that make redux instance globally.

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
  App.css
  App.js
  App.test.js
  index.css
  index.js
  logo.svg
README.md
package.json
```

For the project to build, **these files must exist with exact filenames**:
* run `npm install`

## Available Scripts

if you install the extension "Debugger for chrome" on your VSCode, 
you can simply press F5 to run debugging mode.
and it also run your chrome before the start script run 'npm start'.


## Supported Browsers

PureStateRedux is developped by pure javascript with React, So if you can use React, it will run.

## How to use PureStateRedux

I tried to follow the naming with common redux syntax. But redux is a little too much work,
So I simplified importing and connect processes.

To make actions, make functions like this code:

### `actions/index.js`

```js
import axios from "axios";
const TEST_ACTION1 = "TEST_ACTION1";

export const action1 = function(term){
    let url = "https://ce360567-b6f8-4cd1-9c36-ccb3d4c409db.mock.pstmn.io";
    return {
        type:TEST_ACTION1,
        payload: axios.get(url+"/test/term/"+term)
    };
}
...
export const ACTION_TYPES = {TEST_ACTION1, ...};

const ACTIONS = {
    action1,...
    TEST_ACTION1, ...
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
            return {term:payload.data.a};
        case ACTION_TYPES.TEST_ACTION3:
            return {term:payload.a};
        default:
            return {};
    }
}

export default reducer1;
```

To register your component as an action sender or state receiver, just call 'connect' function of PureStateRedux instance.
in the connect function, there is three arguments.

```js
PureStateRedux.connect(stateToPropMapForReceiver:function, registerAsSender:bool, instanceToUse:Component);
```

stateToPropMapForReceiver function will look like this:

```js
onStateToProp(state){
	return {term:state.term}
}
```

instanceToUse is usually 'this' if you call connect function in the constructor.

and registerAsSender will be true if your component will call actions in your component.
If you want to call the action, your component will have a function this.runAction(action:function, arg:object).

action will be the action that you defined before, and arg will be the argument that the action will get.

Here is a sample code so you can register your component as a action sender.
### `components/Sender.js`
```js
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

```

And this is an example code that you can register your component as a state receiver.

### `components/Receiver.js`

```js
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
```

Of course it can be an action sender and state receiver at the same time.

### `components/SendReceiver.js`

```js
import React,{Component} from "react";

import PureStateRedux from "../pureStateRedux";
import {action2, action3} from "../actions";


export default class SendReceiver extends Component{
    constructor(props){
        super(props);
        this.onChangeValue = this.onChangeValue.bind(this);
        this.state = {term:this.props.value};
        
        PureStateRedux.connect(this.onStateToProp, true, this);
    }
    
    onStateToProp(state){
        return {term:state.term};
    }
    onChangeValue(e){
        this.setState({term:e.target.value});
        if(this.props.action==="3"){
            this.runAction(action3, e.target.value);//send action3
        }else{
            this.runAction(action2, e.target.value);//send action2
        }
    }
   
    render(){
        const val = this.state.term;
        return (
            <div>
                <p>Send(action{this.props.action}):<input onChange={this.onChangeValue} value={val}/></p>
                <p>receive:{this.state.props.term}</p>
            </div>
        );
    }
}
```

In the SendReceiver.js file, I used props.action to reuse this component using different action.
And in the parent component, the action attribute for this component is given.


### `components/index.js`

```js
import React,{Component,createRef} from "react";
import PureStateRedux from "../pureStateRedux";
import Sender from "./Sender";
import Receiver from "./Receiver";
import SendReceiver from "./SendReceiver";
import reducer1 from "../reducers";

PureStateRedux.addReducers(reducer1); //<== register reducers
...
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
...
```

## Something Missing?

If something is missing in this module, please let me know.

Thanks!