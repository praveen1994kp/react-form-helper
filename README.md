# React Form Control Helper
### Micro Controller React component for complex forms

Enables server driven control on following behaviour of form input elements:
- Disable input
- Hide
- Mark as required

Above behaviours can either be enforced by conditions(based on form's state), or always.

### Getting Started:
Installing the package:
~~~
npm install --save react-form-control-helper
~~~
or
~~~
yarn add react-form-control-helper
~~~
#### 1. Controlling a field
To enable controls from the set configuration in the input element, wrap the input element(that supports disabled prop) with this component:
~~~

import { FieldController } from 'react-form-control-helper'
...
function Component() {
return (
<FieldController fieldName='firstName'>
<input type='text' ... />                        
</FieldController>
)
}
~~~
#### 2. Setting the configuration
The main intent of the tool is to provide a no-code control for the forms by providing a UI to create a config and edit it. The below section explains how to integrate the config(fetched from server) to your client side react app.
Wrap your react component containing the form inside the following [Context](https://reactjs.org/docs/context.html):
~~~
import { FieldsConfigurationContext } from  'react-form-control-helper'
~~~

Usage:
~~~
const sampleConfig = {noEdit: ['country'], noRead: ['hiddenField'], required: ['firstName'], rulesList: {
    state: [{
        behaviour: 'DISABLE',
        condition: '${city} = \'Chennai\''
    }, {
        behaviour: 'HIDE',
        condition: '${city} AND !([\'chennai\', \'hyderabad\', \'bangalore\', \'pune\'].includes(${city}.toLowerCase()))'
    }],
    country: [{
        behaviour: 'HIDE',
        condition: '${city} AND !([\'chennai\', \'hyderabad\', \'bangalore\', \'pune\'].includes(${city}.toLowerCase()))'
    }
    ]
}}
return (
	<FieldsConfigurationContext.Provider value={{...sampleConfig, formStateContext: SampleFormStateContext}}>
		<SampleFormDisplay onChange={setFormState}  />
	</FieldsConfigurationContext.Provider>
)
~~~

##### Specs for config
1. **Config**

| field     | type   | sample             |
|-----------|--------|--------------------|
| noEdit    | array  | ['country']        |
| noRead    | array  | ['hiddenField']    |
| required  | array  | firstName          |
| formStateContext | Context |  |
| rulesList | object | *refer table below |
| disabledPropName  | string | 'isDisabled'        |
| requiredPropName  | string | 'isRequired'        |
| ruleSyntaxToJsMap | object | *Refer below sample |

ruleSyntaxToJsMap sample:
~~~
{
    '}': '',
    '=': '===',
    'AND': '&&',
    'OR': '||',
    '-ne': '!=='
}
~~~

2. **rulesList**
Rules List is a javascript object with field name as the form field that is to be controlled.
Example: To control the form field called state:
~~~
rulesList: {
    state: [{
        behaviour: 'DISABLE',
        condition: '${city} = \'Chennai\''
    }, {
        behaviour: 'HIDE',
        condition: '${city} AND !([\'chennai\', \'hyderabad\', \'bangalore\', \'pune\'].includes(${city}.toLowerCase()))'
    }]
}
~~~
| field     | type         | sample                           |
|-----------|--------------|----------------------------------|
| behaviour | string(enum) | 'DISABLE' OR 'HIDE' OR 'MANDATE' |
| condition | string       | "${city} = 'Chennai'"            |

The condition is powered by special syntax, which gets converted into javascript. This means, any browser supported javascript can be written and saved inside it.

It can be as simple as
~~~
"${city} = 'Chennai'"
~~~
Or a little complex as
~~~
"${city} AND !(['chennai', 'hyderabad', 'bangalore', 'pune'].includes(${city}.toLowerCase()))"
~~~
Default mapping from special syntax to javascript:
~~~
{
    '${field}': 'formState.field',
    '=': '===',
    'AND': '&&',
    'OR': '||',
    '-ne': '!=='
}
~~~
This can be further enhanced/overridden by passing ruleSyntaxToJsMap to the config in the context.


#### 3. Linking your state to the controller
There are 2 ways to pass your form's state to the FieldController.
Please note that the state should contain all the states without any nesting.
- Using props:
The FieldController component accepts a prop **formState** that can be used to pass the state object.
- Using Context API:
Alternatively, the form state can be set to a context, and the context can be passed to the root level FieldsConfigurationContext.Provider's value object with key **formStateContext** as in
~~~
	<FieldsConfigurationContext.Provider value={{...sampleConfig, formStateContext: SampleFormStateContext}}>
		<SampleFormDisplay onChange={setFormState}  />
	</FieldsConfigurationContext.Provider>
~~~
The state passed from context is prioritised over the value from prop.

### Running the Example Project:

~~~
cd example

npm install

npm start
~~~
