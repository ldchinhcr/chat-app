import { Emoji, emojiIndex } from "emoji-mart";
import _ from 'lodash';
const React = require('react');
const propTypes = require('prop-types');

export const EmojiReg = (text) => {
    let matchArr;
    let lastOffset = 0;
    const regex = new RegExp(
      '[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}' +
      '\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}' +
      '-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}' +
      '\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}' +
      '\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}' +
      '\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}' +
      '\u{25b6}\u{23f8}-\u{23fa}]', 'gu'
    );
    const getByNative = function(native) {
      return _.find(emojiIndex.emojis, {native});
    };
    const partsOfTheMessageText = [];
    while ((matchArr = regex.exec(text)) !== null) {
      const previousText = text.substring(lastOffset, matchArr.index);
      if (previousText.length) partsOfTheMessageText.push(previousText);

      lastOffset = matchArr.index + matchArr[0].length;

      const emoji = getByNative(matchArr[0])

      if (emoji) {
        partsOfTheMessageText.push(<Emoji emoji={emoji.id} size={22} set='facebook'/>);
      } else {
        partsOfTheMessageText.push(matchArr[0]);
      }
    }
    console.log(partsOfTheMessageText);
    const finalPartOfTheText = text.substring(lastOffset, text.length);
    if (finalPartOfTheText.length)
      partsOfTheMessageText.push(finalPartOfTheText);
    console.log('part',partsOfTheMessageText)
    return (
        <span>
        {partsOfTheMessageText ? partsOfTheMessageText.map((p) => (
          <span>{p}</span>
        )) : text}
        </span>
    );
  };

  EmojiReg.propTypes = {
	text: propTypes.string.isRequired
};