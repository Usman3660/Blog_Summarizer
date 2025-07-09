const dictionary = {
  the: 'دی',
  and: 'اور',
  to: 'کو',
  of: 'کا',
  in: 'میں',
  // Add more mappings as needed
};

export function translateToUrdu(text) {
  return text
    .split(' ')
    .map(word => dictionary[word.toLowerCase()] || word)
    .join(' ');
}