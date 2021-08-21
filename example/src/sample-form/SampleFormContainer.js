import React, { useState } from 'react'
import { SampleFormDisplay } from './SampleFormDisplay'

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
        <SampleFormDisplay formState={formState} onChange={setFormState} />
    )
}