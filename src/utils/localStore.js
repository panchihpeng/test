function set(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

function get(key) {
  return JSON.parse(localStorage.getItem(key))
}

export default {
  set,
  get
}
