/**
 * org
 */
export interface Request {
  id?: number;
  /**
   * 组织（部门）名称
   */
  name: string;
  /**
   * 机构编码
   */
  orgCode: string;
  /**
   * 父级组织（部门）ID()
   */
  parentId: string;

  orgId?: number;
}
