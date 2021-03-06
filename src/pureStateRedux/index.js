const PureStateRedux = function(name){
    const reducers = [];
    const receivers = [];
    
    function changeCurrState(actionWrapper,ret){
        actionWrapper.count++;
        actionWrapper.curr_state = {...actionWrapper.curr_state, ...ret}
        if(actionWrapper.count===reducers.length){
            runCallbacks(actionWrapper.curr_state);
        }
    }
    async function requestAction(actionWrapper, reducer){
        let typeOfAction = typeof(actionWrapper.action);
        if(typeOfAction !== "function"){
            throw "action is not a function";
        }
        let retObj = actionWrapper.action(actionWrapper.value);

        if(retObj.payload && retObj.type){
            if(retObj.payload.then){//check if it is promise result
                await retObj.payload
                .then((resp)=>
                    reducer(retObj.type,resp))
                .then(ret=>changeCurrState(actionWrapper,ret));
            }else{
                let ret = reducer(retObj.type, retObj.payload);
                await changeCurrState(actionWrapper,ret);
            }
        }else{
            throw "action return type os not right. return {type:'action_type', payload:{promise ret or object}";
        }
    }
    
    const runCallbacks=(retStates)=>{
        let totalStates = {};

        for(let a of receivers){
            totalStates = {...totalStates, ...a.exec(retStates)};
        }
        
        for(let a of receivers){
            let newState =  {...a.obj.state.props, ...totalStates};
            a.obj.setState({props:newState});
        }
    }

    const redux = {
        runReducers: function(actionWrapper){
            for(let reducer of reducers){
                requestAction(actionWrapper, reducer);
            }
            //runReducers(actionWrapper);
        }
    };
    return {
        name:name,
        addReducers:function(reducer){
            reducers.push(reducer);
        },
        redux:redux,
        runAction:function(obj, actionCreator, value){
            //let type,payload;
            //({type,payload} = {...action});
            let actionWrapper = {
                count:0,
                state:{props:{...obj.state.props}},
                value:value,
                action:actionCreator
            }
            redux.runReducers(actionWrapper);
            //obj.setState(obj.state);
        },
        connect: function(stateToPropMap, obj, addRunAction){
            if(stateToPropMap){
                receivers.push({
                    obj:obj,
                    exec:stateToPropMap
                });
                //run one time
                if(!obj.state)
                    obj.state = {...obj.state, props: {...stateToPropMap({})}};
                else
                    obj.state = {...obj.state, props: {...stateToPropMap(obj.state)}};
            }
            if(addRunAction){
                //this function only can be used for single redux.
                obj.runAction = function(actionCreator, value){
                    //let type,payload;
                    //({type,payload} = {...action});
                    let actionWrapper = {
                        count:0,
                        state:{props:{...obj.state.props}},
                        value:value,
                        action:actionCreator
                    }
                    redux.runReducers(actionWrapper);
                    //obj.setState(obj.state);
                }
                
            }
        }
        
    };
    
}

export default PureStateRedux;