package selector

import (
	"regexp"
	"strings"
)

// Keyword heuristic intent inference, ported verbatim from
// jev_router/route.py _infer_by_keywords. This is the zero-dependency
// baseline the learned kNN falls back to when it has not seen a task shape.
// Substring matching semantics are preserved exactly (leading/trailing spaces
// in some keywords are intentional).

var hanRe = regexp.MustCompile(`[\p{Han}]`)

var (
	translateWords    = []string{"翻译", "translate"}
	multilingualWords = []string{"英文", "德语", "日文", "english", "summarize in", "多语言", "跨语言", "in english"}
	longDocWords      = []string{"长文", "通读", "整份", "全量", "whole", "long document",
		"百万字", "1m 上下文", "长上下文", "超长", "long context", "long-context", "tokens"}
	codeLangWords = []string{"python", " java", "go ", "golang", "rust", "typescript",
		"javascript", " c++", " c#", "kotlin", "swift", "php", "ruby", "scala"}
	codeActionWords = []string{"写代码", "编程", "编码", "写程序", "写脚本", "重构", "重构成",
		"实现", "代码实现", "调试", "定位并修复", "修复", "bug", "单测", "单元测试",
		"函数", "算法", "代码块", "代码", "脚本", "服务", "接口", "模块",
		"架构", "tests", "test", "implement", "implementation", "api",
		"sdk", "class", "method", "function", "loop", "thread", "async",
		"并发", "微服务", "refactor", "debug", "write a", "writes",
		"code", "script", "schema", "database", "sql", "cli",
		"pipeline", "ci ", "def ", "import "}
	codeStrongWords = []string{"写代码", "编程", "代码", "bug", "重构", "单元测试", "单测"}
	visionWords     = []string{"截图", "照片", "x光", "原理图", "看这张", "图片", "图像", "image",
		"screenshot", "photo", "ocr", ".png", ".jpg", ".jpeg", ".webp", ".gif",
		"白板", "报表"}
	reasoningWords = []string{"推理", "证明", "推导", "逻辑", "推演", "数学", "逻辑题",
		"证明题", "竞赛题", "求解", "公式", "归纳", "组合优化",
		"多步推理", "辨析",
		"research", "analyze deeply", "math", "prove", "deduce",
		"solve", "optimize", "problem", "algorithm", "calculate", "why"}
	agenticWords = []string{"智能体", "agent", "自动登录", "自主", "多步", "循环", "试错", "自动",
		"工作流", "workflow", "autonomously", "agentic", "定时", "调度",
		"订票", "行程规划", "跨系统"}
	toolsWords = []string{"搜索", "联网", "天气", "查一下", "调用", "接口", "search", "web",
		"api call", "实时", "数据库", "对比", "采购建议"}
	writingWords = []string{"邮件", "标题", "写作", "总结成", "文案", "润色", "周报", "报告",
		"文章", "write", "email", "polish", "summary", "纪要", "要点",
		"说明", "介绍", "博客", "推文"}
	cheapHintWords = []string{"便宜", "省钱", "高并发", "量大", "cheap", "cost", "预算", "high volume"}
	hardHintWords  = []string{"复杂", "困难", "难", "深度", "hard", "complex", "difficult",
		"深度推理", "刁钻", "最强", "旗舰"}
	longUnitRe = regexp.MustCompile(`(\d[\d,]*)\s*(页|万字|字|pages|k\s*pages)`)
)

func containsAny(t string, words []string) bool {
	for _, w := range words {
		if strings.Contains(t, w) {
			return true
		}
	}
	return false
}

// inferByKeywords returns (tags, difficulty, hits).
func inferByKeywords(text string) (map[string]struct{}, float64, []string) {
	t := strings.ToLower(text)
	tags := map[string]struct{}{}
	d := 1.0
	hits := []string{}
	add := func(tag, hit string, bump float64) {
		tags[tag] = struct{}{}
		d += bump
		hits = append(hits, hit)
	}

	// Chinese: only when the Han-rune count and ratio both clear the bar, so a
	// stray 页/字 inside English text (or a 中文 noun inside code) cannot trigger it.
	han := len(hanRe.FindAllString(text, -1))
	total := runeLen(text)
	if total < 1 {
		total = 1
	}
	if han >= 3 && float64(han)/float64(total) >= 0.2 {
		tags["chinese_strong"] = struct{}{}
		hits = append(hits, "chinese")
	}

	// Multilingual / translation (independent tag, does not imply code).
	isTranslate := containsAny(t, translateWords)
	if isTranslate || containsAny(t, multilingualWords) {
		tags["multilingual"] = struct{}{}
		hits = append(hits, "multilingual")
	}

	// Long context: numeric doc size (>=200 pages / >=3万字 / k pages) or explicit wording.
	longByNum := false
	if m := longUnitRe.FindStringSubmatch(text); m != nil {
		num := 0
		for _, ch := range strings.ReplaceAll(m[1], ",", "") {
			if ch >= '0' && ch <= '9' {
				num = num*10 + int(ch-'0')
			}
		}
		unit := m[2]
		switch {
		case unit == "页" || unit == "pages":
			longByNum = num >= 200
		case unit == "万字":
			longByNum = num >= 3
		case strings.Contains(unit, "k") || strings.Contains(unit, "pages"):
			longByNum = true
		}
	}
	if longByNum || containsAny(t, longDocWords) {
		add("long_ctx", "long_ctx", 1.4)
	}

	// Code: a fence, or (language name + action word), never for translation.
	codeFence := strings.Contains(text, "```")
	codeLang := containsAny(t, codeLangWords)
	codeAction := containsAny(t, codeActionWords)
	codeTrig := codeFence || (codeLang && codeAction) || containsAny(t, codeStrongWords)
	if codeTrig && !isTranslate {
		add("code", "code", 0.9)
	}

	// Vision: avoid the single-char 图 false positive (diagrams are concepts).
	if containsAny(t, visionWords) {
		add("vision", "vision", 0.8)
	}

	// Reasoning: strong signals only, so weak words like 分析 do not trigger it.
	if containsAny(t, reasoningWords) {
		add("reasoning", "reasoning", 1.3)
	}

	// Agentic / autonomous work.
	if containsAny(t, agenticWords) {
		add("agentic", "agentic", 1.3)
	}

	// Tools / realtime.
	if containsAny(t, toolsWords) {
		add("tools", "tools", 0.5)
	}

	// Writing.
	if containsAny(t, writingWords) {
		add("writing", "writing", 0.2)
	}

	// Difficulty hints.
	if containsAny(t, cheapHintWords) {
		d -= 0.6
		hits = append(hits, "cheap_hint")
	}
	if containsAny(t, hardHintWords) {
		d += 0.8
		hits = append(hits, "hard_hint")
	}

	if len(tags) == 0 {
		tags["general"] = struct{}{}
	}
	if d < 1.0 {
		d = 1.0
	}
	if d > 5.0 {
		d = 5.0
	}

	// Per-capability difficulty floors so medium-hard tasks are not mis-read
	// as easy ones. long_ctx is not floored at 4.0 (its labeled range is 3.0-4.5).
	if _, ok := tags["reasoning"]; ok && d < 4.2 {
		d = 4.2
	}
	if _, ok := tags["agentic"]; ok && d < 4.2 {
		d = 4.2
	}
	if _, ok := tags["long_ctx"]; ok && d < 3.4 {
		d = 3.4
	}
	return tags, d, hits
}
