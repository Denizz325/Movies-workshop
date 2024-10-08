import jwt from 'jsonwebtoken'
import util from 'util'

 const verify = util.promisify(jwt.verify)
 const sign = util.promisify(jwt.sign)

 export default {
    verify,
    sign
 }