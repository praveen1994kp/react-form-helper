/* eslint-disable react/prop-types */
import React, { Children, cloneElement, createContext, useContext, useMemo } from 'react'
import { formatRule } from './rule-parse-helpers'

export const FieldsConfigurationContext = createContext({
    noRead: null,
    noEdit: null,
    required: null,
    rulesList: null,
    ruleSyntaxToJsMap: null,
    disabledPropName: null,
    requiredPropName: null,
    formStateContext: null
})


const RULE_BEHAVIOUR = {
    DISABLE: 'DISABLE',
    HIDE: 'HIDE',
    MANDATE: 'MANDATE'
}

const RULE_FLAGS_DEFAULT_VAL = {disabledByRule: false, hiddenByRule: false, requiredByRule: false}

export function FieldController ({fieldName, children, formState: formStateFromProp, shouldDisableField, shouldHideField, shouldMandateField}) {
    if (!fieldName) return <>{children}</>
    const {noEdit, noRead, required, 
        rulesList, requiredPropName, disabledPropName, formStateContext} = useContext(FieldsConfigurationContext)

    const formStateContextVal = useContext(formStateContext)

    const formState = formStateContextVal?.formState || formStateFromProp

    const hasRules = useMemo(() => {
        if (!rulesList || !(rulesList[fieldName]) || rulesList[fieldName].length < 1) return false

        return true
    }, [fieldName, rulesList])

    const {disabledByRule, hiddenByRule, requiredByRule} = useMemo(() => {
        let returnVal = RULE_FLAGS_DEFAULT_VAL

        try {
            if (!hasRules || !formState) return returnVal

            const rules = rulesList[fieldName] || []

            rules.forEach(ruleObj => {
                const formStateObjArgName = 'formState'
                const finalRuleString = formatRule(ruleObj.condition, formStateObjArgName)
                const ruleTester = Function(formStateObjArgName, finalRuleString)
                const isQualified = ruleTester(formState)

                if (isQualified) {
                    switch (ruleObj.behaviour) {
                    case RULE_BEHAVIOUR.DISABLE: {
                        returnVal = {...returnVal, disabledByRule: true}
                        break
                    }
                    case RULE_BEHAVIOUR.HIDE: {
                        returnVal = {...returnVal, hiddenByRule: true}
                        break
                    }
                    case RULE_BEHAVIOUR.MANDATE: {
                        returnVal = {...returnVal, requiredByRule: true}
                        break
                    }
                    default: 
                        break
                    }
                }
            })

            return returnVal
        } catch (ex) {
            console.warn(`Error occurred while trying to process rules for ${fieldName}`, ex)

            return returnVal
        }

    }, [hasRules, formState]) || {}

    const isNoRead = (noRead && noRead.includes(fieldName)) || hiddenByRule || (typeof shouldHideField === 'function' && shouldHideField(formState))

    if (isNoRead) return null

    const isRequired = (required && required.includes(fieldName)) || requiredByRule || (typeof shouldMandateField === 'function' && shouldMandateField(formState))
    const isNoEdit = (noEdit && noEdit.includes(fieldName)) || disabledByRule || (typeof shouldDisableField === 'function' && shouldDisableField(formState))

    if (isNoEdit || isRequired) {
        return Children.map(children, (child) => {
            const finalDisabledPropName = disabledPropName || 'disabled'
            const finalRequiredPropName = requiredPropName || 'required'
            return cloneElement(child, {
                [finalDisabledPropName]: isNoEdit,
                [finalRequiredPropName]: isRequired,
                ...(child.props)
            })
        })
    }

    return <>{children}</>

}