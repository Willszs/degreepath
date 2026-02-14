export type ResourceItem = {
  slug: string;
  title: string;
  subtitle: string;
  highlights: string[];
};

export const resourceItems: ResourceItem[] = [
  {
    slug: "cv-template",
    title: "CV 模板",
    subtitle: "英文/德文简历结构",
    highlights: ["单页优先", "量化经历", "关键词匹配项目描述", "导出 PDF 统一命名"],
  },
  {
    slug: "motivation-letter-template",
    title: "动机信模板",
    subtitle: "结构化写作框架",
    highlights: ["开头直给目标", "匹配课程与经历", "结尾给出未来计划", "控制在 1 页内"],
  },
  {
    slug: "application-email-template",
    title: "申请邮件模板",
    subtitle: "教授/招生办沟通",
    highlights: ["主题行规范", "正文三段式", "附件命名统一", "礼貌跟进节奏"],
  },
  {
    slug: "visa-doc-checklist",
    title: "签证材料清单",
    subtitle: "递签前核对表",
    highlights: ["预约确认材料", "资金证明完整", "翻译与公证版本", "复印件备份"],
  },
  {
    slug: "pre-departure-checklist",
    title: "行前清单",
    subtitle: "出发前 30 天准备",
    highlights: ["住宿确认", "保险生效日期", "随身文件夹", "紧急联系人备份"],
  },
  {
    slug: "germany-life-toolkit",
    title: "德生活工具箱",
    subtitle: "落地后常用资源",
    highlights: ["注册流程入口", "银行/通信方案", "交通票类型", "办事预约平台"],
  },
];
