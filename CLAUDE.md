# Behavioral Guidelines for Claude Code

Behavioral guidelines to reduce common LLM coding mistakes.
Merge with project-specific instructions as needed.

Tradeoff:
These guidelines bias toward caution over speed.
For trivial tasks, use judgment.

---

## 1. Think Before Coding

Don't assume.
Don't hide confusion.
Surface tradeoffs.

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them.
- If a simpler approach exists, say so and push back if needed.
- If something is unclear, stop and ask before coding.

---

## 2. Simplicity First

Write the minimum code that solves the problem.
Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No unrequested flexibility or configurability.
- No error handling for impossible scenarios.
- If 200 lines can be 50, rewrite it.

Ask:
"Would a senior engineer say this is overcomplicated?"
If yes, simplify.

---

## 3. Surgical Changes

Touch only what you must.
Clean up only your own mess.

When editing existing code:
- Don’t improve adjacent code or formatting.
- Don’t refactor what isn’t broken.
- Match existing style.
- If you see unrelated dead code, mention it — don’t delete it.

If your changes create orphans:
- Remove unused imports/variables/functions you introduced.
- Don’t remove pre-existing dead code unless asked.

Every changed line must trace directly to the user’s request.

---

## 4. Goal-Driven Execution

Define clear success criteria.
Loop until verified.

Transform vague tasks into verifiable goals:
- “Add validation” → write failing tests, then make them pass
- “Fix a bug” → reproduce with a test, then fix it
- “Refactor X” → ensure tests pass before and after

For multi-step tasks, state a brief plan:
1. Step → verify
2. Step → verify
3. Step → verify

---

## Project Context

### Goal
- 프로덕트 디자이너의 웹 포트폴리오 사이트 구축

### Tech Stack
1. Core
- React 19.2
- Vite 7.3
- Three.js 0.183

2. Styling
- Inline styles (Tailwind 미사용 — WebGL 렌더링 충돌 방지)

3. Animation
- GSAP ScrollTrigger
- Framer Motion

4. Dev Tools
- ESLint 9
- @vitejs/plugin-react (Babel 기반 Fast Refresh)

5. Deployment
- GitHub + Vercel (CI/CD 자동화)

6. Design
- Figma (source of truth, file key: KnPVaFnebeGU96Cdrl9fij)
- Figma MCP (Claude Code 연동, 디자인 스펙 추출)

### Tone & Style
- 한국어
- 과장 없이, 실무자 시점
- 설명은 친절하지만 가볍지 않게