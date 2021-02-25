import React, { createContext } from 'react'
import useTransformationInputState from '../hooks/useTransformationInputState'

export const TransformationContext = createContext();

export const TransformationProvider = ({ children }) => {
    const [currTransformation, changeTransform] = useTransformationInputState("DCT");
    const [type, handleTypeChange] = useTransformationInputState("transform");
    const [typeDimension, handleTypeDimensionChange] = useTransformationInputState("1D");

    return (
        <TransformationContext.Provider value={{ currTransformation, changeTransform, type, handleTypeChange, typeDimension, handleTypeDimensionChange }}>
            {children}
        </TransformationContext.Provider>
    )
}
