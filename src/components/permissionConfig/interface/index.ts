export type TypeProps = "menu" | "button" | "module";
/**
 * MenuVo
 *
 * 系统管理-菜单资源表
 */
export interface TreeType {
  /**
   * 当前选中菜单
   */
  active?: string;
  /**
   * 菜单子菜单[ 系统管理-菜单资源表 ][ 系统管理-菜单资源表 ]
   */
  children?: TreeType[];
  /**
   * 页面路径
   */
  component?: string;
  /**
   * 添加时间
   */
  createTime?: string;
  /**
   * 是否启用
   */
  enabledInd?: boolean;
  /**
   * 是否外链
   */
  externalInd?: boolean;
  /**
   * 菜单图标
   */
  icon?: string;
  /**
   * 是否隐藏
   */
  isHidden?: boolean;
  /**
   * 层级
   */
  level?: number;
  /**
   * 主键id
   */
  menuId: number;
  /**
   * 菜单所属模块
   */
  menuModule?: string;
  /**
   * 菜单名称
   */
  menuName: string;
  /**
   * 菜单英文名称
   */
  menuNameEn?: string;
  /**
   * 父级id
   */
  parentId?: number;
  /**
   * 权限标识
   */
  perIdentity?: string;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 资源类型（menu，button, module）
   */
  type: TypeProps;
  /**
   * 更新时间
   */
  updateTime?: string;
  /**
   * 页面路由
   */
  url?: string;
  breadcrumb: boolean;
  // 是否被选中
  flag: boolean;
}
