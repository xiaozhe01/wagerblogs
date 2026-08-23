// Real, sourced content — NOT placeholder data, which is why this lives in its
// own module rather than lib/mock-data.ts (placeholder content) or
// lib/site-data.ts (structure/taxonomy only). The question text below is
// reproduced verbatim from the National Council on Problem Gambling's public
// self-assessment and must stay verbatim: it is a validated instrument, and
// paraphrasing it invalidates the scoring bands underneath.
//
// Instrument: NODS (NORC Diagnostic Screen for Gambling Problems), 10 items,
// yes/no, scored as a count of "yes" answers.

export const selfAssessmentSource = {
  organisation: "National Council on Problem Gambling",
  instrument: "NODS (NORC Diagnostic Screen for Gambling Problems)",
  url: "https://www.ncpgambling.org/help-treatment/problem-gambling-self-assessments/problem-gambling-self-assessment/",
};

export const selfAssessmentQuestions = [
  "Have there ever been periods lasting two weeks or longer when you spent a lot of time thinking about your gambling experiences, planning out future gambling ventures or bets, or thinking about ways of getting money to gamble with?",
  "Have there ever been periods when you needed to gamble with increasing amounts of money or with larger bets than before in order to get the same feeling of excitement?",
  "Have you ever felt restless or irritable when trying to stop, cut down, or control your gambling?",
  "Have you tried and not succeeded in stopping, cutting down, or controlling your gambling three or more times in your life?",
  "Have you ever gambled to escape from personal problems, or to relieve uncomfortable feelings such as guilt, anxiety, helplessness, or depression?",
  "Has there ever been a period when, if you lost money gambling one day, you would often return another day to get even?",
  "Have you lied to family members, friends, or others about how much you gamble, and/or about how much money you lost on gambling, on at least three occasions?",
  "Have you ever written a bad cheque or taken money that didn't belong to you from family members, friends, or anyone else in order to pay for your gambling?",
  "Has your gambling ever caused serious or repeated problems in your relationships with any of your family members or friends? Or, has your gambling ever caused you problems at work or your studies?",
  "Have you ever needed to ask family members, friends, a lending institution, or anyone else to loan you money or otherwise bail you out of a desperate money situation that was largely caused by your gambling?",
];

export type SelfAssessmentResult = {
  label: string;
  description: string;
};

export function getSelfAssessmentResult(score: number): SelfAssessmentResult {
  if (score === 0) {
    return {
      label: "No Problems",
      description: "No criteria for pathological or problem gambling were met.",
    };
  }
  if (score <= 2) {
    return {
      label: "At-Risk",
      description:
        "The individual shows an increased likelihood of progression to more severe problem status compared to those scoring zero.",
    };
  }
  if (score <= 4) {
    return {
      label: "Problem Gambling",
      description:
        "Results show clear patterns of harmful gambling behavior that warrant attention or behavior modification.",
    };
  }
  return {
    label: "Pathological Gambling",
    description:
      "Results meet multiple clinical criteria for a serious addiction, indicating an urgent need to seek professional treatment or support.",
  };
}
