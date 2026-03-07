/**
// @param {string} context
// @param {object|string} error
*/

export function ErrorLogger(context, error) {
    const message = error?.message || error || "else"

    const details = error?.details ? `, Details: ${error.details}` : ''
    const hint = error?.hint ? `, Hint: ${error.hint}` : ''

    console.group(`Error in [${context}]`)
    console.error(`Message: ${message}${details}${hint}`)

    if (typeof error === 'object') console.dir(error)
    console.groupEnd();
}