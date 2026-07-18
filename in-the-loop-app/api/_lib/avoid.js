// Builds the "don't repeat this" context passed into the daily prompt.
// News/language only need to dodge yesterday (they're inherently time-bound),
// but slang and popculture pull from a wider recent-days window — otherwise
// the model has nothing stopping it from converging on the same "safe" pick
// (e.g. the same slang term, or the same popculture category) every few days.
function dedupe(list) {
  return [...new Set(list.filter(Boolean))];
}

export function buildAvoidContext(recentDays) {
  const days = recentDays.filter(Boolean);
  const mostRecent = days[0] || null;
  return {
    languagePhrase: mostRecent?.language?.phrase,
    newsHeadline: mostRecent?.news?.headline,
    recentSlangTerms: dedupe(days.map((d) => d.slang?.term)),
    recentPopcultureTitles: dedupe(days.map((d) => d.popculture?.title)),
    recentPopcultureCategories: dedupe(days.map((d) => d.popculture?.category)),
  };
}
