# AURA-GUARD Risk Scoring Engine

## Objective
The risk scoring engine converts messy AI usage into a boardroom-readable score from 0 to 100.

## Factors

| Factor | Max Score | Meaning |
|---|---:|---|
| Data Sensitivity | 15 | How sensitive is the data touched by AI? |
| Tool Autonomy | 15 | Can AI take real actions or only draft? |
| External Exposure | 10 | Is the AI customer-facing or public-facing? |
| Approval Weakness | 15 | Are risky actions missing human approval? |
| Vendor Risk | 10 | Is the vendor unclear on data use/security? |
| Prompt Injection Risk | 15 | Has the agent been tested against manipulation? |
| Logging Weakness | 10 | Are actions traceable? |
| Compliance Gap | 10 | Are policies/evidence missing? |

## Bands

0–20: Low Risk
21–40: Moderate Risk
41–60: Elevated Risk
61–80: High Risk
81–100: Critical Risk

## Output Requirements

Every assessment must generate:
- total score
- risk band
- top 3 risk drivers
- executive summary
- immediate mitigation steps
- 30-day remediation roadmap

## Commercial Use
The risk scoring engine is the heart of the paid audit. It must be visible in the dashboard, report PDF, and sales demo.
