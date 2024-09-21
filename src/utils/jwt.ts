import jwt from 'jsonwebtoken'

export const sign = (payload: {id: number}, expiresIn: string | number): string => {
    return jwt.sign(payload, "number", {expiresIn})
}
export const verify = (token: string) => {
    return jwt.verify(token, "number")
}