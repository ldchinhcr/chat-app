import _ from 'lodash';
import data from "emoji-mart/data/facebook.json";
import { NimbleEmojiIndex } from 'emoji-mart';

export function getByNative(native) {
    let emojiIndex = new NimbleEmojiIndex(data)
    return _.find(emojiIndex.emojis, {native});
};