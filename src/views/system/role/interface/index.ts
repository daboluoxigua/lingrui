/**
 * RoleVo
 */
export interface Request {
  roleId?: number;
  isEnable?: boolean;
  /**
   * 角色描述
   * 角色描述
   */
  roleDesc?: string;
  /**
   * 角色名
   * 角色名
   */
  roleName: string;
  /**
   * 角色标识
   * 角色标识
   */
  roleSign: string;
  isSystem?: boolean;
}
