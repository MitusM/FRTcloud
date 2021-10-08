// === === === === === === === === === === === ===
// Authorization
// === === === === === === === === === === === ===
// import crypto from 'crypto'
let crypto;
try {
    crypto = await import('crypto');
} catch (err) {
    console.log('crypto support is disabled!');
}

const {
    createHmac
} = await import('crypto');

class Authorization {
    constructor(options) {

    }
    get password() {
        return this._plainPassword
    }

    set password(password) {
        this._plainPassword = password
        this.salt = crypto.randomBytes(32).toString('hex')
        this.hashedPassword = this.encryptPassword(password)
    }

    // encryptPassword(password, salt) {
    //     salt = salt || this.salt
    //     return crypto.createHmac('sha256', this.salt).update(password).digest('hex')
    // }

    hashPassword(password, salt) {
        this.salt = (salt) || crypto.randomBytes(32).toString('hex')
        return crypto.createHmac('sha256', this.salt).update(password).digest('hex')
    }

    /**
     * Проверить пароль по хешу
     * @param   {string}  password пароль пользователя
     * @returns {boolean} true если совпал
     */
    validatePassword(password) {
        return this.encryptPassword(password) === this.hashedPassword
    }
}

export default Authorization