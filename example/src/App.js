/* eslint-disable quotes */
import React from 'react'
import { FieldsConfigurationContext } from './form-control-helper/FieldController'
import { SampleForm } from './sample-form/SampleFormContainer'

const sampleConfig = {noEdit: ['country'], noRead: ['hiddenField'], rulesList: {
    state: [{
        behaviour: 'DISABLE',
        condition: "${city} = 'Chennai'"
    }, {
        behaviour: 'HIDE',
        condition: "${city} AND !(['chennai', 'hyderabad', 'bangalore', 'pune'].includes(${city}.toLowerCase()))"
    }],
    country: [{
        behaviour: 'HIDE',
        condition: "${city} AND !(['chennai', 'hyderabad', 'bangalore', 'pune'].includes(${city}.toLowerCase()))"
    }
    ]
}}

export function App() {
    return (
        <FieldsConfigurationContext.Provider value={sampleConfig}>
            <SampleForm />
        </FieldsConfigurationContext.Provider>
    )
}