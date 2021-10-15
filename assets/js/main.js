String.prototype.hexEncode = function(){
    let hex, i;

    let result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

let input = document.querySelector('#input');
let output = document.querySelector('#output');
let copyBtn1 = document.querySelector('#copy-btn1');
let copyBtn2 = document.querySelector('#copy-btn2');
let notice = document.querySelector('#notice');

input.addEventListener('keyup', () => {
    displayOutput(langInput.value);
})

let copy = target => {
    navigator.clipboard.writeText(target.innerText);
}

copyBtn1.addEventListener('click', () => copy(output));
copyBtn2.addEventListener('click', () => copy(notice));

let langBtn = document.querySelector("#lang-btn");
let langsList = document.querySelector("#langs-list");
let langOptions = document.querySelectorAll(".lang");
let langInput = document.querySelector("#lang-inp");
let submitBtn = document.querySelector("#submit-btn");

langBtn.addEventListener('click', () => {
    if([...langsList.classList].includes('hidden')) {
        langsList.classList.remove('hidden')
    } else {
        langsList.classList.add('hidden');
    }
})

langOptions.forEach(lang => {
    lang.addEventListener('click', () => {
        langBtn.innerHTML = lang.innerText;
        langsList.classList.add('hidden');
        langInput.value = lang.innerText.toLowerCase();
        render(langInput.value);
        displayOutput(langInput.value);
    })
})

function render(lang = 'c') {
    if (lang == 'c') {
        output.innerHTML = `_setmode(_fileno(stdout), _O_U16TEXT);    //Chỉ cần 1 lệnh này ở mỗi file <br>
                            wprintf(L"{Output ở đây} \\n");`;
        notice.innerHTML = `#include &lt;stdio.h&gt;<br>
                            #include &lt;fcntl.h&gt;`                          
    } else if (lang == 'c++') {
        output.innerHTML = `_setmode(_fileno(stdout), _O_U16TEXT);    //Chỉ cần 1 lệnh này ở mỗi file <br>
                            std::wcout << L"{Output ở đây}"`;
        notice.innerHTML = `#include &lt;iostream&gt;<br>
                            #include &lt;fcntl.h&gt;<br>
                            #include &lt;io.h&gt;`
    }
}

function displayOutput(lang = 'c') {

    let htlmTarget = '_setmode(_fileno(stdout), _O_U16TEXT); //chỉ cần 1 lệnh này ở mỗi file <br>';
    // let excludedChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~\d\s\w]/;
    let inputArr = input.value.split('\n');
    for (let line of inputArr) {
        let outputText = '';      
        if (lang == 'c') {
            for (let char of line) {
                // outputText += excludedChars.test(char) ? '\\0' + char : '\\x' + char.hexEncode();
                outputText += '\\x' + char.hexEncode();
            }
            htlmTarget += `wprintf(L"${outputText} \\n");<br>`;                                      
        } else if (lang == 'c++') {
            for (let char of line) {
                // outputText += excludedChars.test(char) ? '\\0' + char : '\\u' + char.hexEncode();
                outputText += '\\u' + char.hexEncode();
            }
            htlmTarget += `std::wcout << L"${outputText} \\n";<br>`
        }
    }
    output.innerHTML = htlmTarget;
}

render();