export default {
  utcDate() {
    return new Date(new Date().toUTCString().slice(0, -4))
  },
}
