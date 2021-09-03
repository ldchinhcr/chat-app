import _ from 'lodash'
import data from 'emoji-mart/data/facebook.json'
import { Data, NimbleEmojiIndex } from 'emoji-mart'

export function getByNative(native: string) {
  // @ts-ignore
  const emojiIndex = new NimbleEmojiIndex(data as Data)
  return _.find(emojiIndex.emojis, { native })
}
