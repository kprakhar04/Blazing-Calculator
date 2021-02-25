import { useState } from 'react'

export default initialVal => {
    const [value, setValue] = useState(initialVal)

    const handleChange = name => {
        setValue(name)
    }
    const reset = () => {
        setValue("none")
    }
    return [value, handleChange, reset]
}