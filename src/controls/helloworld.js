export function hello() {
    let txt = "hello world 123";
    let element = document.createElement("div");
    element.innerText = txt;
    element.className += " bg-test-image";
    element.style.cssText="width:300px; height:200px;";
    document.body.appendChild(element);
    console.log(txt);
}
export default hello;