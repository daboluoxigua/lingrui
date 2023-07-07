/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(http?:|mailto:|tel:)/.test(path);
}
/**
 *@description '密码不能低于8位数，并且包含英文字母'
 * @param str
 */
export function isValidPwd(str) {
  const reg = /^(?=.*[a-zA-Z])[^][\S]{7,}$/;
  return reg.test(str);
}
/**
 *@description 验证用户名格式 3-15个字母或数字
 * @param str
 */
export function isValidUsername(str) {
  const reg = /^[a-z0-9_]{6,20}$/;
  return reg.test(str);
}

/**
 *@description 验证角色名称 2-20个字母或数字
 * @param str
 */
export function isValidRoleName(str) {
  const reg = /^[a-z0-9_]{2,20}$/;
  return reg.test(str);
}

/**
 *@description 验证角色唯一标识 1-50个字母或数字
 * @param str
 */
export function isValidRoleSign(str) {
  const reg = /^[a-z0-9_]{1,50}$/;
  return reg.test(str);
}

/**
 *@description 验证组织编码格式 1-50个字母或数字
 * @param str
 */
export function isValidOrgCode(str) {
  const reg = /^[a-z0-9]{1,50}$/;
  return reg.test(str);
}

/**
 * @description 验证URL地址格式
 * @param str
 * @returns {boolean}
 */
export function isValidUrl(str) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(str);
}

/**
 * @description 判断是否全部小写
 * @param str
 * @returns {boolean}
 */
export function isLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/**
 * @description 判断是否全部大写
 * @param str
 * @returns {boolean}
 */
export function isUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/**
 * @description 判断是否全为字母
 * @param str
 * @returns {boolean}
 */
export function isAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * @description 判断是否全为数字
 * @param str
 * @returns {boolean}
 */
export function isDigital(str) {
  const reg = /^[0-9]+$/;
  return reg.test(str);
}

/**
 * @description 判断是否为正整数和浮点数
 * @param str
 * @returns {boolean}
 */
export function isFloating(str) {
  const reg = /^[0-9]+.?[0-9]*$/;
  return reg.test(str);
}

/**
 * @description 不能包含中文和特殊字符
 * @param str
 * @returns {boolean}
 */
export function isSpecial(str) {
  const reg = /^[A-Za-z0-9_]+$/;
  return reg.test(str);
}

/**
 * @description 正负数、正负浮点数
 * @param str
 * @returns {boolean}
 */
export function isPositive(str) {
  // eslint-disable-next-line no-useless-escape
  const reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/;
  return reg.test(str);
}

/**
 * @description 判断是否有中文（也包含日文和韩文）
 * @param str
 * @returns {boolean}
 */
export function isCharacter(str) {
  const reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
  return reg.test(str);
}

/**
 * @description 判断是否为电话号码
 * @param str
 * @returns {boolean}
 */
export function isPhoneNumber(str) {
  const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  return reg.test(str);
}

/*
  判断是否是 固定电话
  @returns {boolean}
*/
export function isTelephoneNumber(str) {
  const reg =
    /^(0?(13[0-9]|15[012356789]|166|17[013678]|18[0-9]|14[57])[0-9]{8})|(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;
  return reg.test(str);
}

export function validPhone(rule, value, callback) {
  if (value === "") {
    callback(new Error("请输入手机号码"));
  } else {
    if (!/^0?1[3|4|5|6|7|8][0-9]\d{8}$/.test(value)) {
      callback(new Error("请输入正确的手机号码"));
    }
    callback();
  }
}

/**
* 判断是否为邮箱
* @param string $email

* @param boolean
*/
export function isEmail(str) {
  const reg = /^[0-9a-z_][_.0-9a-z-]{0,32}@([0-9a-z][0-9a-z-]{0,32}\.){1,4}[a-z]{2,4}$/i;
  return reg.test(str);
}

/**
 * 验证数据源名称格式
 * @param string $email

 * @param boolean
 */
export function isDatasourceName(str) {
  let reg = new RegExp(/^(?!_)[0-9a-zA-Z_]{1,}$/);
  return reg.test(str);
}

/**
 * @description 判断是否为中文，字母，数字组成(非特殊字符）
 * @param str
 * @returns {boolean}
 */
export function isNonSpecial(str) {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
  return reg.test(str);
}
