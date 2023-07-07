export interface userInfo {
  userId: number;
  username: string;
  nickName: string;
  sex: string;
  roleList: [];
  orgId: number;
  orgName: string;
  orgLevel: number;
  parentOrgId: number;
  orgCode: string;
  orgCodePath: string;
  createTime: string;
  token: string;
  clusterId: number;
  clusterName: number;
  clusterNickName: number;
  clusterType: number;
  clusterEnvironment: number;
  clusterAuthType: number;
  isOrgAdmin: boolean;
}

export interface configData {
  /**
   * 审计日志保存天数
   */
  auditLogSaveDays: number;
  /**
   * 浏览器图标
   */
  favicon: string;
  /**
   * 平台名称
   */
  platformName: string;
  /**
   * 系统Logo
   */
  systemLogo: string;
  /**
   * 略缩图Logo
   */
  thumbnailLogo: string;
}
