import React, { createContext, useState } from 'react'
import { FieldsConfigurationContext } from '../form-control-helper/FieldController'
import { SampleFormDisplay } from './SampleFormDisplay'

export const SampleFormStateContext = createContext({formState: null})


// This typically comes from server if the configuration is stored in a database.
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

export function SampleForm() {
    const [formState, setFormState] = useState({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: 'Tamilnadu',
        country: 'India',
        hiddenField: ''
    })

    return (
        <SampleFormStateContext.Provider value={{formState}}>
            <FieldsConfigurationContext.Provider value={{...sampleConfig, formStateContext: SampleFormStateContext}}>
                <SampleFormDisplay onChange={setFormState} />
            </FieldsConfigurationContext.Provider>
        </SampleFormStateContext.Provider>
    )
}