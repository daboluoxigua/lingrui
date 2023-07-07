/**
 * UserVo
 */
export interface Request {
  userId?: number;
  /**
   * 邮箱地址
   */
  email: string;
  /**
   * 手机号
   */
  mobile: string;
  /**
   * 昵称
   */
  nickName: string;
  /**
   * 组织ID
   */
  orgId?: number;
  /**
   * 登录密码
   */
  password: string;
  /**
   * 用户角色
   */
  roleIdList?: number[];
  roleList?: number[];
  /**
   * 性别
   */
  sex: string;
  /**
   * 登录名
   */
  userName: string;
}
