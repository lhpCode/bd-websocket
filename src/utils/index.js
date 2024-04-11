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

// 返回26位随机id
export const generateRandomId = () => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  const date = String(Date.now());

  for (var i = 0; i < 16; i++) {
    result +=
      characters.charAt(Math.floor(Math.random() * charactersLength)) +
      characters.charAt(Number(date.charAt(i)));
  }
  return result;
};
