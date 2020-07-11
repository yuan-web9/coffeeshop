import { Toast } from 'vant';
class ValidForm {
    constructor() {
        this.ValidUserFormReg = {

            // 昵称验证
            nickName: {
                reg: /^[\u4e00-\u9fa5\w]{1,10}$/,
                msg: '昵称格式不正确'
            },

            // 手机号验证
            phone: {
                reg: /^1[3-8]\d{9}$/,
                msg: '手机号格式不正确'
            },

            // 密码
            password: {
                reg: /^[a-zA-Z]\w{5,15}$/,
                msg: '密码格式不正确,请以字母开头'
            },

            // 邮箱
            email: {
                reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                msg: '邮箱格式不正确'
            },
            // 6位验证码格式正确
            number: {
                reg: /^\d{6}$/,
                msg: '验证格式不正确'
            }
        }
    }

    // 验证表单方法
    validUserForm(o, self) {
        for (let key in o) {
            if (!this.ValidUserFormReg[key].reg.test(o[key])) {
                Toast(this.ValidUserFormReg[key].msg);
                return false;
            }
        }

        return true;
    }
}

export default new ValidForm();