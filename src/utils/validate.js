/**
 * 表单格式校验相关
 */

import {forOwn} from "lodash";
import {setStateSync, msgCallBack, isPromise} from "@/utils/tool";
/**
 * 校验必填
 */
export const validateRequired = (value) => {
  return !!value;
}

/**
 * 校验用户名格式
 * @param value
 */
export const validateUserAccount = (value) => {
  return /^[a-zA-Z0-9@#$%^&*:.。;,-~_]{4,20}$/.test(value);
}

/**
 * 判断密码格式是否正确
 * @param value
 */
export const validatePassword = (value) => {
  // return /^[a-zA-Z0-9@#$%^&*:.。;,-~_]{6,16}$/.test(value);
  return /(?!^(\d+|[a-zA-Z]+|[@#$%^&*:.。;,\-~_]+)$)^[\w@#$%^&*:.。;,\-~]{6,16}$/.test(value);
}

/**
 * 校验身份证格式
 * @param value
 * @return {boolean}
 */
export const validateIdCard = (value) => {
  if (!value) return true;
  return /(^[1-9]\d{14}$)|(^[1-9]\d{17}$)|(^[1-9]\d{16}(\d|X|x)$)/.test(value);
}

/**
 * 校验手机号格式
 * @param value
 * @return {boolean}
 */
export const validatePhone = (value) => {
  return /^1\d{10}$/.test(value);
}

/**
 * 校验表单
 * @param rules
 * @param validate
 * @param info
 * @param that
 * @param trigger
 */
export const validateForm = async (rules, validate, info, that, trigger = 'submit') => {
  forOwn(rules, (value, key) => {
    if(value && Array.isArray(value) && value.length > 0) {
      forOwn(value, item => {
        if(item.required) {
          if(!validateRequired(info[key])) {
            validate[key] = msgCallBack(item.message, info[key]);
          }
        }
        if(item.validator) {
          if (item.promise) {
            if (trigger !== 'blur') return false;
            item.validator(info[key])
              .then(res => {
                if (!res) {
                  validate[key] = msgCallBack(item.message, info[key]);
                  setStateSync(that, {
                    validate
                  })
                }
              })
            return false;
          } else if (!item.validator(info[key])) {
            validate[key] = msgCallBack(item.message, info[key]);
          }
        }
        if (validate[key]) {
          return false;
        }
      })
    }
  })
  await setStateSync(that, {
    validate
  })
  return Promise.resolve(!(Object.keys(validate).some(key => validate[key])));
}
