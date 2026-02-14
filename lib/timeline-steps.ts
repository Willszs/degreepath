export type TimelineStep = {
  slug: string;
  title: string;
  subtitle: string;
  items: string[];
};

export const timelineSteps: TimelineStep[] = [
  {
    slug: "step-1",
    title: "定位与选校",
    subtitle: "目标 / 预算 / 专业",
    items: ["目标国家与城市", "预算与生活成本", "专业方向与课程匹配", "院校清单与优先级"],
  },
  {
    slug: "step-2",
    title: "语言与考试",
    subtitle: "IELTS / TestDaF 等",
    items: ["目标分数与截止时间", "备考计划", "报名与考位", "出分与复议策略"],
  },
  {
    slug: "step-3",
    title: "材料准备",
    subtitle: "CV / 动机信 / 推荐信",
    items: ["CV（英文/德文）", "动机信结构", "推荐人沟通", "材料版本管理"],
  },
  {
    slug: "step-4",
    title: "申请提交与跟进",
    subtitle: "邮件 / 系统",
    items: ["申请系统清单", "邮件模板", "时间节点追踪", "补件与面试准备"],
  },
  {
    slug: "step-5",
    title: "签证与资金证明",
    subtitle: "清单化",
    items: ["材料总清单", "资金证明/冻结", "预约与递签流程", "常见坑与补充材料"],
  },
  {
    slug: "step-6",
    title: "行前与落地",
    subtitle: "住宿 / 保险 / 开户",
    items: ["住宿与 Anmeldung", "保险选择", "开户与手机卡", "落地一周生存清单"],
  },
];
