import React from "react"

const InputError = ({ error, message, touched }: any) => {
  return (
    <>
      {error && (
        <p style={{ color: "red" }} className="small w-100">
          {/* {errors.fieldName && touched.fieldName && errors.fieldName} */}
          {message}
        </p>
      )}
    </>
  )
}

export default InputError;