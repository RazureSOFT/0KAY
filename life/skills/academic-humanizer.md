# academic-humanizer

Strip AI-writing tells from papers and grant proposals (NSF/NIH) while keeping scholarly voice and tying every claim to evidence. Use when editing or reviewing AI-assisted academic prose: paper sections, abstracts, rebuttals, related work, theses, and funding proposals (NSF Project Summary/Description, NIH Specific Aims). Never changes a number, result, or citation, and is not for evading AI-use disclosure.

tags: academic paper thesis proposal nsf nih writing polish humanize editing

Source: https://github.com/AIScientists-Dev/academic-humanizer (MIT). Chinese drafts: use the `academic-humanizer-zh` skill.

## When to use

Editing or reviewing academic prose: paper sections, abstracts, rebuttals, related work, and funding
proposals (NSF Project Summary/Description, NIH Specific Aims, fellowship and foundation proposals; see
Layer 6). Not for blogs, marketing, or personal essays, and never inject opinion, humor, or first-person
"personality" into a manuscript. For technical writing, neutral and precise *is* the human voice.

One caveat for proposals: their register differs from a paper's, because they are sold on vision and
feasibility, so the ambition language a paper would trim is appropriate there. Apply Layer 6, not the
paper layers' stricter trimming, to vision statements.

## Core principle

Academic writing already has a correct human voice: neutral, precise, third-person plural ("we"), every
claim tied to its evidence. The job is to (1) strip the AI tells without casualizing, and (2) enforce the
discipline a general humanizer misses: every claim earns its number, figure, or citation, and no verb is
stronger than its evidence.

## Process

1. **Read** the manuscript and any author writing sample; note the document type (paper vs. funding
   proposal) and the target venue or funding agency. For proposals, also apply Layer 6.
2. **Audit** (do not edit yet): list each detected pattern with its location and proposed fix, and each
   empirical claim's evidence status.
3. **Rewrite**: same structure and content, all claims and citations preserved, tells removed,
   over-claims matched to evidence, legitimate hedging kept.
4. **Report**: cleaned text plus a short change log (patterns removed, claims softened or given evidence
   pointers, voice notes). Cover everything the original covered: if it had five paragraphs, so does the
   rewrite.

## Layer 1: General AI-tell catalog

Scan for and fix the general patterns, subject to the academic exceptions in Layer 3:

- inflated significance ("marking a pivotal moment")
- superficial "-ing" tails that fake depth ("..., highlighting...")
- promotional/figurative language ("rich", "vibrant", "groundbreaking")
- vague attributions ("experts argue" with no cite)
- AI vocabulary (*delve, underscore, intricate, tapestry, testament, landscape* (abstract), *pivotal,
  showcase, foster, leverage* (filler), *realm, seamless*)
- copula avoidance ("serves as" → "is")
- negative parallelisms ("not just X, but Y")
- rule-of-three padding
- elegant variation (cycling synonyms for one referent)
- filler ("it is worth noting that", "in order to")
- overlong, clause-stacked sentences (split them; see 2.11)
- em-dashes (remove entirely; recast with commas, colons, parentheses, or separate sentences)

Before: *Additionally, an enduring testament to the method's value is its ability to delve into intricate
dependencies, showcasing a seamless integration that underscores its pivotal role.*

After: *The method also captures higher-order dependencies, which the baselines miss (Table 2).*

## Layer 2: Academic AI tells

### 2.1 Over-claiming verbs
Empirical work *shows* and *provides evidence*; it does not *prove* or *demonstrate* universal truths.
Watch: demonstrate, prove, establish, confirm, guarantee; "significantly" with no test or number.
Before: *We prove that our method significantly outperforms all prior approaches.*
After: *Our method improves held-out accuracy by 4-7 points over the strongest prior approach (Table 3);
the gain is significant at p < 0.01 by a paired test.*

### 2.2 Significance hype
Watch: paves the way for, a crucial/pivotal step toward, has the potential to revolutionize, opens new
avenues, sheds light on, of paramount importance, bridges the gap.
Before: *This work paves the way for a new paradigm and sheds light on a problem of paramount importance.*
After: *This work addresses one failure mode of prior methods: error accumulation under long-horizon
rollout (Section 4).*

### 2.3 Empty intensifiers
Watch: extensive/comprehensive/thorough experiments, a wide range of, numerous, various.
Before: *We conduct extensive experiments on a wide range of datasets.*
After: *We evaluate on three datasets (ImageNet, CIFAR-100, and iNaturalist).*

### 2.4 Novelty padding
Watch: "novel" more than once per section; "to the best of our knowledge"; "for the first time".
Before: *We propose a novel framework and, to the best of our knowledge, are the first to study this.*
After: *We study online calibration under delayed labels, which prior (offline) calibration work does not
address.*

### 2.5 Formulaic openers
Watch: "In recent years, X has attracted increasing attention"; "With the rapid development of...";
"Despite recent advances,...".
Before: *In recent years, tabular deep learning has attracted increasing attention.*
After: *Tabular deep learning has a structural limitation: most models discard feature-type metadata and
must relearn it from data.*

### 2.6 Connective overuse
Do not start consecutive sentences with Moreover/Furthermore/Additionally/In particular; let logic carry.

### 2.7 Contribution-list cliches
Each contribution names a specific result, not a restatement of the abstract.
Before: *Our contributions are: (1) a novel method; (2) extensive experiments; (3) strong results.*
After: *We (1) introduce a metadata-aware encoder that reaches 0.91 AUROC vs 0.86 for the strongest
baseline; (2) show it stays within 2 points under 20% label noise where the baseline drops 9; (3) release
the benchmark.*

### 2.8 Citation dumping
Cite the one or two works that matter and say why, not a bracketed list.
Before: *Many methods exist [3, 7, 9, 12, 15].*
After: *The closest prior method is TabNet [7], which encodes all features jointly; we instead condition on
feature-type metadata.*

### 2.9 Hedging-by-vagueness
Watch: somewhat, relatively, fairly, to some extent, quite. Quantify or cut.
Before: *Performance is somewhat better and relatively robust.*
After: *Accuracy is 3 points higher and varies by less than 1 point across five seeds.*

### 2.10 Boilerplate emphasis
Watch: "It is worth noting that", "It should be emphasized that", "Notably,", "Importantly,". If it
matters, the sentence shows it.

### 2.11 Overlong, clause-stacked sentences
AI favors long sentences that chain three or four clauses with commas and "which", "that", "while",
"with". Split them: one idea per sentence, and cut subordinate clauses that carry no weight. Watch:
sentences past ~30 words, or with 3+ subordinate clauses.
Before: *Existing methods, though promising, are largely empirical, with unclear principles underpinning
their behavior, which limits their reliability and further progress.*
After: *Existing methods stay empirical. Their principles are unclear, which limits reliability and
progress.*

## Layer 3: Preserve these (do NOT over-correct)

A general humanizer flattens legitimate scholarly constructs. Keep them.

- **Evidence-tied hedging is correct and required.** Keep "suggests", "is consistent with", "we
  hypothesize that", "may indicate", "appears to" when the claim is genuinely uncertain. Turning "the
  results suggest X" into "the results prove X" manufactures over-claiming.
- **Passive voice** is fine when the actor is irrelevant: "Samples were normalized to total protein."
- **First-person plural "we"** is standard; do not rewrite to avoid it.
- **Semicolons and an occasional triple** are fine in moderation. Em-dashes are the exception: remove them
  entirely, recasting with commas, colons, parentheses, or separate sentences.
- **Formal definitions, named methods/metrics, technical terms, equations, and symbols** stay verbatim.
- **Never invent, drop, or alter a number, equation, or citation.** Same content; preserve every cite key.

## Layer 4: Claim-evidence discipline

For every empirical claim, check (a) is it backed by a number, figure, table, or citation in the text,
and (b) does the verb match the strength of that evidence?

- **Unbacked claim → add the evidence pointer or soften.**
  *Our method is more robust.* → *Our method's accuracy drops by 2 points under distribution shift,
  versus 11 points for the baseline (Figure 3).*
- **Verb stronger than evidence → downgrade.**
  *This demonstrates that our method is universally superior.* → *On these three datasets, our method
  matches or exceeds the strongest baseline (Table 2).*
- **Vague magnitude → a number or RANGE, attributed.**
  *a large improvement* → *a 2-6% improvement in balanced accuracy over the strongest baseline.*
  Prefer ranges over single averaged values unless the averaging method is stated, and attribute each
  number to its method, metric, and baseline. Lead comparisons against the strongest competitor, not the
  trivial baseline.

## Layer 5: Voice and venue matching

If the author supplies prior papers, read a sample first and note sentence rhythm, connective habits,
level and placement of hedging, how they open sections, notation, and recurring phrasings, then match
them. Match the venue's register too (ICLR/NeurIPS: terse, direct, results-forward; Nature/PNAS: more
expository). Absent a sample, default to clean, precise, venue-appropriate prose, not the casual,
opinionated voice of a general-purpose humanizer.

## Layer 6: Funding-proposal mode (NSF, NIH)

A proposal is not a paper. It is sold on vision plus feasibility, not on finished results, and reviewers
score it. Ambition language that the paper layers would trim ("long-term goal", "pioneer",
"transformative", "establish a foundation") is appropriate and expected here, provided a credible plan and
evidence back it. So in proposal mode, do not flatten the vision; enforce claim ↔ feasibility instead.

### 6.1 Know the structure; the score lives in the first pages

- **NSF.** A one-page Project Summary with the three review-criteria heads spelled out: Overview,
  Intellectual Merit, Broader Impacts, each self-contained. The Project Description opens with long-term
  vision → this proposal's goal → the gap → the specific thrusts/aims → the payoff, ideally within the
  first 1-2 pages, with one overview figure. Broader Impacts must be substantive and integrated, never an
  afterthought.
- **NIH (R01).** The Specific Aims page is the whole proposal in one page and is the most-read, most
  decisive page. Standard arc: (1) the problem, what is known, the gap/critical need; (2) the long-term
  goal and the central hypothesis with its rationale; (3) "The objective of this application is..." plus
  how the hypothesis was formed; (4) 2-3 Aims, each a one-line goal + a phrase on approach + the expected
  outcome; (5) a payoff paragraph. Then Significance, Innovation, Approach as separately scored sections.

### 6.2 First-3-pages primacy (edit these hardest)

By the end of page 1 (NIH Aims) or pages ~2-3 (NSF), the reader must already hold: the hook (why it
matters, concretely), the gap (what is missing and the cost of the gap), the central idea (your approach
in one sentence), the aims/thrusts (crisp and parallel), and the payoff. If any is missing or buried, fix
that before touching later sections.

### 6.3 Proposal-specific weak moves to fix

- **Vague importance.** *Understanding this problem is critically important.* → *Without bounds on how
  measurement noise propagates to diagnosis, clinical models are tuned by trial and error, the
  inefficiency this proposal removes.*
- **Method-as-aim** (an aim naming a technique instead of a question or outcome). *Aim 2: Apply transfer
  learning to the dataset.* → *Aim 2: Determine whether fusing wearable and lab signals improves early
  detection, and for which patient subgroups it helps or hurts.*
- **Dominoed aims** (Aim 2/3 collapse if Aim 1 fails). Phrase aims as parallel and independently valuable;
  where one depends on another, state the fallback.
- **Ambition without feasibility.** Every bold claim needs a footing: preliminary data, a prior
  result/publication, a classical theorem you build on, or a collaborator/letter. Attach the evidence
  beside the claim.
- **Boilerplate Broader Impacts / training plan.** Make it concrete, enumerated, and tied to the research:
  specific programs, named courses or tools, measurable outreach.
- **Hedged central hypothesis.** The Aims-page hypothesis is a falsifiable commitment, not "we will
  explore whether possibly...". Calibrated hedging belongs in the Approach's interpretation.

### 6.4 Preserve and deploy (funded-proposal craft)

- Vision/ambition framing: a bold long-term goal up front, with this proposal as one principled step.
- Run-in lead-ins for scannability: **Goal:**, **Motivation:**, **Innovation:**, *Aim/Thrust N (one-line
  mission):*. Reviewers skim; visible structure earns time.
- A concrete running example or protagonist to make an abstract method vivid across aims.
- Sharp challenge/aim statements posed as questions.
- Anchoring novel work in deep, named classical results to signal rigor and lineage.
- Foreground the team's standing as feasibility evidence: prior funded work, preliminary results,
  publications, collaborators, demonstration partners. Use only the PI's own real, supplied record; never
  invent funding, results, partners, or letters.

### 6.5 Claim ↔ feasibility

For every aim and promised outcome, check: is the ambition matched by a credible means (preliminary data,
a prior method, a classical foundation, a collaborator, staged de-risking)? If yes, keep the ambitious
verb. If no, attach the missing evidence or scale the claim to what the plan supports. Never invent
preliminary results, prior funding, partners, or letters; if the support does not exist, flag the gap for
the author.

## Output

Return the cleaned text plus a short change report: patterns removed (by type), claims softened or given
evidence pointers, and any voice/venue notes. Confirm that no number, equation, or citation was altered.
