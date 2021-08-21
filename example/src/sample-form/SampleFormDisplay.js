/* eslint-disable react/prop-types */
import React from 'react'
import { FieldController } from '../form-control-helper/FieldController'

function TextField ({value, onChange, label = 'Text Field', ...props}) {
    return (
        <div className="row mt-3">
            <label htmlFor="first-name-input" className="form-label">
                {label}
            </label>
            <input
                id={`${label.toLowerCase()}-input`}
                className="form-control"
                type="text"
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    )
}

export function SampleFormDisplay ({formState, onChange}) {

    const getFormInputHandler = fieldName => event => {
        onChange({...formState, [fieldName]: event.target.value})
    }

    return (
        <section className='container-fluid'>
            <div className='d-flex justify-content-center my-4'>
                <h4 >Sign Up</h4>
            </div>
            <form>
                <div className="container">
                    <FieldController fieldName='firstName' formState={formState}>
                        <TextField value={formState.firstName} onChange={getFormInputHandler('firstName')} label='First Name' />
                    </FieldController>
                    <FieldController fieldName='lastName' formState={formState}>
                        <TextField value={formState.lastName} onChange={getFormInputHandler('lastName')} label='Last Name' />
                    </FieldController>
                    <FieldController fieldName='street' formState={formState}>
                        <TextField value={formState.street} onChange={getFormInputHandler('street')} label='Street' />
                    </FieldController>
                    <FieldController fieldName='city' formState={formState}>
                        <TextField value={formState.city} onChange={getFormInputHandler('city')} label='City' />
                    </FieldController>
                    <FieldController fieldName='state' formState={formState}>
                        <TextField value={formState.state} onChange={getFormInputHandler('state')} label='State' />
                    </FieldController>
                    <FieldController fieldName='country' formState={formState}>
                        <TextField value={formState.country} onChange={getFormInputHandler('country')} label='Country' />
                    </FieldController>
                    <FieldController fieldName='hiddenField' formState={formState}>
                        <TextField value={formState.hiddenField} onChange={getFormInputHandler('hiddenField')} label='Hidden Field' />
                    </FieldController>
                </div>
            </form>
        </section>
    )
}