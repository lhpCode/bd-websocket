const infomation = document.getElementById("info")
infomation.innerText = `本应用正在使用chrome(v${versions.chrome()})`

const func = async () => {
    const response = await window.versions.ping()
    console.log(response);
    infomation.innerText = response
}
func()
console.log("222222222222222222");
setTimeout(() => {
    console.log("1111111111111111111");
    window.electronAPI.counterValue("哈哈哈哈")
    setTimeout(() => {
        func()
    }, 1000)
}, 5000)