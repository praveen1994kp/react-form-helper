/* eslint-disable react/prop-types */
import React, { useContext } from 'react'
import { FieldController } from '../form-control-helper/FieldController'
import { SampleFormStateContext } from './SampleFormContainer'

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

export function SampleFormDisplay ({onChange}) {

    const {formState} = useContext(SampleFormStateContext)

    const getFormInputHandler = fieldName => event => {
        onChange({...formState, [fieldName]: event.target.value})
    }

    return (
        <section className='container-fluid row'>
            <form className='mx-auto col-lg-4 col-sm-8'>
                <div className='d-flex justify-content-center my-4'>
                    <h4 >Sign Up</h4>
                </div>
                <div className="container">
                    <FieldController fieldName='firstName'>
                        <TextField value={formState.firstName} onChange={getFormInputHandler('firstName')} label='First Name' />
                    </FieldController>
                    <FieldController fieldName='lastName'>
                        <TextField value={formState.lastName} onChange={getFormInputHandler('lastName')} label='Last Name' />
                    </FieldController>
                    <FieldController fieldName='street'>
                        <TextField value={formState.street} onChange={getFormInputHandler('street')} label='Street' />
                    </FieldController>
                    <FieldController fieldName='city'>
                        <TextField value={formState.city} onChange={getFormInputHandler('city')} label='City' />
                    </FieldController>
                    <FieldController fieldName='state'>
                        <TextField value={formState.state} onChange={getFormInputHandler('state')} label='State' />
                    </FieldController>
                    <FieldController fieldName='country'>
                        <TextField value={formState.country} onChange={getFormInputHandler('country')} label='Country' />
                    </FieldController>
                    <FieldController fieldName='hiddenField'>
                        <TextField value={formState.hiddenField} onChange={getFormInputHandler('hiddenField')} label='Hidden Field' />
                    </FieldController>
                    <div className='row'>
                        <button type='submit' className='btn btn-primary mt-4'>Submit</button>
                    </div>
                </div>
            </form>
        </section>
    )
}