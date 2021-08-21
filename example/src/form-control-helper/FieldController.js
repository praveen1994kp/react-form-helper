/* eslint-disable react/prop-types */
import React, { Children, cloneElement, createContext, useContext, useMemo } from 'react'

export const FieldsConfigurationContext = createContext({
    noRead: null,
    noEdit: null,
    required: null,
    rulesList: null,
    ruleSyntaxToJsMap: null,
    disabledPropName: null,
    requiredPropName: null
})

const DEFAULT_RULE_SYNTAX_TO_JS_MAP = {
    '}': '',
    '=': '===',
    'AND': '&&',
    'OR': '||',
    '-ne': '!=='
}

const RULE_BEHAVIOUR = {
    DISABLE: 'DISABLE',
    HIDE: 'HIDE',
    MANDATE: 'MANDATE'
}

function formatRule(ruleStr, formStateObjArgName, ruleSyntaxToJsMap) {
    const finalSyntaxMapper = ruleSyntaxToJsMap ? {...DEFAULT_RULE_SYNTAX_TO_JS_MAP, ruleSyntaxToJsMap} : DEFAULT_RULE_SYNTAX_TO_JS_MAP

    if (typeof ruleStr !== 'string') return ''

    const withFormStateObjRef = ruleStr.replaceAll('${', formStateObjArgName + '.')
    let jsFunctionDefn = withFormStateObjRef

    jsFunctionDefn = Object.keys(finalSyntaxMapper).reduce((jsRule, ruleKey) => {
        return jsRule.replaceAll(ruleKey, finalSyntaxMapper[ruleKey])
    }, jsFunctionDefn)

    return `return ${jsFunctionDefn}`
}

const RULE_FLAGS_DEFAULT_VAL = {disabledByRule: false, hiddenByRule: false, requiredByRule: false}

export function FieldController ({fieldName, children, formState}) {
    if (!fieldName) return <>{children}</>
    const {noEdit, noRead, required, 
        rulesList, requiredPropName, disabledPropName} = useContext(FieldsConfigurationContext)

    const hasRules = useMemo(() => {
        if (!rulesList || !(rulesList[fieldName]) || rulesList[fieldName].length < 1) return false

        return true
    }, [fieldName, rulesList])

    const {disabledByRule, hiddenByRule, requiredByRule} = useMemo(() => {
        let returnVal = RULE_FLAGS_DEFAULT_VAL

        try {
            if (!hasRules) return returnVal

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

    if ((noRead && noRead.includes(fieldName)) || hiddenByRule) return null

    const isRequired = (required && required.includes(fieldName)) || requiredByRule
    const isNoEdit = (noEdit && noEdit.includes(fieldName)) || disabledByRule

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