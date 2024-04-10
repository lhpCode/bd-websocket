export const getTime = () => {
  const time = new Date();
  const Y = time.getFullYear();
  let M = time.getMonth() + 1;
  M = M < 10 ? "0" + M : M;
  let D = time.getDate();
  D = D < 10 ? "0" + D : D;
  let h = time.getHours();
  h = h < 10 ? "0" + h : h;
  let m = time.getMinutes();
  m = m < 10 ? "0" + m : m;
  let s = time.getSeconds();
  s = s < 10 ? "0" + s : s;
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
};
