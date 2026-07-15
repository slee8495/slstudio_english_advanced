// Builds the "don't repeat this" list passed into the daily prompt, sourced
// from the previous day's cached content, so back-to-back generations (e.g.
// today + tomorrow's preview) can't converge on the same live headline pool.
export function avoidFromContent(content) {
  if (!content) return null;
  return {
    languagePhrase: content.language?.phrase,
    slangTerm: content.slang?.term,
    newsHeadline: content.news?.headline,
    popcultureTitle: content.popculture?.title,
  };
}
