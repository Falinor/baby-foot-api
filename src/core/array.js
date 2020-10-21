export function hasDuplicate(array) {
  const map = new Map()
  for (let i = 0; i < array.length; i++) {
    const item = array[i]
    if (map.has(item)) {
      return true
    }
    map.set(item, item)
  }
  return false
}
